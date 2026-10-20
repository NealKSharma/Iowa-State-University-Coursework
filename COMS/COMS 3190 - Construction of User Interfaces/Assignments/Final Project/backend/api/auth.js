const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");

const router = express.Router();

//these are the roles the app knows about.
const allowedRoles = new Set(["patient", "doctor", "pharmacist", "admin"]);

function usersCollection(db) {
  return db.collection(process.env.USERS_COLLECTION || "users");
}

function refreshTokensCollection(db) {
  return db.collection(process.env.REFRESH_TOKENS_COLLECTION || "refreshTokens");
}

function jwtSecret() {
  //this signs the access token so people cannot fake their own login token
  return process.env.JWT_SECRET || "saint-cys-dev-secret";
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeRole(role) {
  //if someone sends a weird role, just make them a patient.
  const cleanRole = String(role || "patient").trim().toLowerCase();
  return allowedRoles.has(cleanRole) ? cleanRole : "patient";
}

function publicUser(user) {
  //never send passwordHash back to the frontend
  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name || "Hospital User",
    email: user.email || "",
    role: normalizeRole(user.role),
    phone: user.phone || "",
    specialization: user.specialization || "",
    createdAt: user.createdAt || null,
  };
}

async function findUserByEmail(collection, email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  return collection.findOne(
    { email: normalizedEmail },
    { collation: { locale: "en", strength: 2 } }
  );
}

function issueAccessToken(user) {
  //short login token for normal api calls. default is 15 minutes
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: normalizeRole(user.role),
      email: user.email || "",
    },
    jwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );
}

function hashRefreshToken(refreshToken) {
  //store only a sha256 hash of the refresh token, not the real token
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
}

async function issueRefreshToken(db, user) {
  //this decides refresh token logtime. default is 7 days.
  const refreshToken = crypto.randomBytes(48).toString("hex");
  const now = new Date();
  const ttlDays = Number(process.env.REFRESH_TOKEN_DAYS || 7);
  const expiresAt = new Date(now.getTime() + ttlDays * 24 * 60 * 60 * 1000);

  await refreshTokensCollection(db).insertOne({
    userId: user._id,
    tokenHash: hashRefreshToken(refreshToken),
    createdAt: now,
    expiresAt,
  });

  return refreshToken;
}

async function issueSession(db, user) {
  //one login response has the user, access token, and refresh token.
  return {
    user: publicUser(user),
    accessToken: issueAccessToken(user),
    refreshToken: await issueRefreshToken(db, user),
  };
}

async function requireAuth(req, res, next) {
  try {
    //protected api routes use Authorization: Bearer accessToken.
    const authHeader = req.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return res.status(401).json({ message: "Missing authentication token." });
    }

    const payload = jwt.verify(token, jwtSecret());
    const db = await getDb();
    const user = ObjectId.isValid(payload.sub)
      ? await usersCollection(db).findOne({ _id: new ObjectId(payload.sub) })
      : null;

    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired login session." });
  }
}

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const db = await getDb();
    const user = await findUserByEmail(usersCollection(db), email);

    //bcrypt compares the typed password with the saved password Hash
    if (!user || !(await bcrypt.compare(password, user.passwordHash || ""))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json(await issueSession(db, user));
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    const role = "patient";

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const db = await getDb();
    const collection = usersCollection(db);
    const existingUser = await findUserByEmail(collection, email);

    if (existingUser) {
      return res.status(409).json({ message: "An account with that email already exists." });
    }

    const now = new Date();
    const userDocument = {
      name,
      email,
      role,
      //bcrypt hashes the password before it ever goes into mongodb.
      passwordHash: await bcrypt.hash(password, 12),
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(userDocument);
    const user = { ...userDocument, _id: result.insertedId };

    res.status(201).json(await issueSession(db, user));
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required." });
    }

    const db = await getDb();
    const tokenHash = hashRefreshToken(refreshToken);
    const storedToken = await refreshTokensCollection(db).findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
    });

    if (!storedToken) {
      return res.status(401).json({ message: "Invalid or expired refresh token." });
    }

    const user = await usersCollection(db).findOne({ _id: storedToken.userId });

    if (!user) {
      await refreshTokensCollection(db).deleteOne({ _id: storedToken._id });
      return res.status(401).json({ message: "User no longer exists." });
    }

    //delete old refresh token and rotate into a new session token par
    await refreshTokensCollection(db).deleteOne({ _id: storedToken._id });
    res.json(await issueSession(db, user));
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const db = await getDb();
      const tokenHash = hashRefreshToken(refreshToken);

      //logout removes the refresh token soit cannot make new access tokens.
      await refreshTokensCollection(db).deleteOne({ tokenHash });
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.requireAuth = requireAuth;
router.publicUser = publicUser;
router.normalizeEmail = normalizeEmail;
router.normalizeRole = normalizeRole;
router.usersCollection = usersCollection;
router.refreshTokensCollection = refreshTokensCollection;

module.exports = router;
