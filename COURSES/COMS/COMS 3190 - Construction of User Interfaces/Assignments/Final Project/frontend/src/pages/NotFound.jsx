function NotFound({ onNavigate }) {
  return (
    <main className="error-page">
      <section className="error-panel">
        <p className="eyebrow">Page Not Found</p>
        <h1>Invalid Route</h1>
        <p>The page you tried to open does not exist in Saint Cy's Hospital.</p>
        <button className="btn-submit" onClick={() => onNavigate("home")} type="button">
          Go Home
        </button>
      </section>
    </main>
  );
}

export default NotFound;
