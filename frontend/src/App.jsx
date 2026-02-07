import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-background text-text">
      <nav className="p-6 flex justify-between items-center premium-container">
        <h2 className="text-2xl font-bold gradient-text">Social Mentor</h2>
        <div className="flex gap-6">
          <a href="#donations" className="font-medium hover:text-primary transition-colors">Donations</a>
          <a href="#volunteer" className="font-medium hover:text-primary transition-colors">Volunteer</a>
          <button className="btn btn-primary">Join Now</button>
        </div>
      </nav>

      <main className="premium-container mt-12 text-center">
        <div className="glass-card max-w-4xl mx-auto py-16">
          <h1 className="gradient-text">Empowering Change through Giving</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with donors, mobilize volunteers, and ensure your contributions reach those who need them most.
            A structured platform for a more compassionate society.
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn btn-primary px-8 py-4 text-lg">I want to Donate</button>
            <button className="btn border-2 border-primary text-primary px-8 py-4 text-lg hover:bg-primary hover:text-white transition-all">Become a Volunteer</button>
          </div>
        </div>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-bold mb-2">Easy Donations</h3>
            <p>Post food, clothes, or toys in minutes. We handle the coordination.</p>
          </div>
          <div className="glass-card p-8">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2">Volunteer Network</h3>
            <p>Join a community of dedicated individuals making a real impact locally.</p>
          </div>
          <div className="glass-card p-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Track Your Impact</h3>
            <p>See exactly where your contributions go and earn appreciation badges.</p>
          </div>
        </section>
      </main>

      <footer className="mt-24 py-12 border-t border-gray-200 text-center text-muted">
        <p>© 2026 Social Mentor. Built with ❤️ for humanity.</p>
      </footer>
    </div>
  );
}

export default App;
