# Iowa State University Coursework

My coursework, projects, notes, and research from Iowa State University. This is where I keep my programming assignments, lab reports, papers, and the notes I've taken along the way.

## Repository structure

```text
.
├── COURSES/
│   ├── COMS/                # Computer science
│   ├── CYBER/               # Cybersecurity
│   ├── DATA SCIENCE/        # Data science
│   ├── ENGL/                # Writing and technical communication
│   └── OTHERS/              # History, physics, statistics, and seminar work
├── OneNote Notebooks/       # Course notes stored with Git LFS
├── RESEARCH/
│   └── ASTRO/               # Astronomy scripts, datasets, and analysis results
├── .gitattributes           # Git LFS configuration
└── .gitignore
```

## Coursework

| Area | Courses |
| --- | --- |
| [Computer science](COURSES/COMS/) | COMS 1060, 2270, 2280, 3090, 3110, 3190, 3210, 3270, and 3520 |
| [Cybersecurity](COURSES/CYBER/) | CYBE 2300 — Cyber Security Fundamentals |
| [Data science](COURSES/DATA%20SCIENCE/) | DS 2010 — Introduction to Data Science |
| [English](COURSES/ENGL/) | ENGL 2500 — Written, Oral, Visual, and Electronic Composition; ENGL 3140 — Technical Communication |
| [Other subjects](COURSES/OTHERS/) | HIST 2010, PHYS 2310, STAT 3030, and UST 1100 |

Assignments, lecture examples, exams, and reports are organized by course.

## Projects and research

- **[Saint Cy's Hospital Management Website](COURSES/COMS/COMS%203190%20-%20Construction%20of%20User%20Interfaces/Assignments/Final%20Project/README.md)** — A hospital management website built with React, Node.js, Express, and MongoDB for patients, doctors, pharmacists, and admins.
- **[Goldilock Zone Investigators](COURSES/DATA%20SCIENCE/DS%202010%20-%20Introduction%20to%20Data%20Science/Readme.md)** — Our DS 2010 project on predicting exoplanet temperatures using data about the planets, their orbits, and their host stars.
- **[TESS-LS astronomy research](RESEARCH/ASTRO/README.md)** — Python tools for downloading TESS observations, searching for periods with Lomb–Scargle analysis, and comparing nearby Gaia sources. The folder includes supporting data and saved results.

## Downloading the repository

The OneNote `.one` files use **Git Large File Storage (LFS)**. Install [Git LFS](https://git-lfs.com/) before cloning to download the complete notebooks.

```bash
git lfs install
git clone https://github.com/NealKSharma/Iowa-State-University-Coursework.git
cd Iowa-State-University-Coursework
git lfs pull
```

If you already cloned the repository, run `git lfs install` and `git lfs pull` inside your local copy.

There's a lot of data and media here, so the first download may take a while.

## Author

[Neal Kaushik Sharma](https://github.com/NealKSharma)

Credits for team projects are in each project's README.
