function Footer() {
  return (
    <footer className="footer">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 gap-8">
        <div>
          <h3>Saint Cy's Hospital</h3>
          <p>SE/COM S 3190 - Team AH17 - Iowa State University</p>
        </div>

        <div>
          <h4>Team AH17</h4>
          <ul className="flex flex-col gap-1">
            <li>Neal Sharma - nea1@iastate.edu</li>
            <li>Devank Uppal - duppal@iastate.edu</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        2026 Saint Cy's Hospital - SE/COM S 3190 - Iowa State University
      </div>
    </footer>
  );
}

export default Footer;