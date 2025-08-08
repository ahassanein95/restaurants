export default function Footer() {
  return (
    <footer id="footer" className="wrapper style1-alt bg-gray-900 py-8">
      <div className="inner max-w-6xl mx-auto px-4">
        <ul className="menu flex flex-wrap justify-center items-center space-x-6 text-sm text-white/60">
          <li>&copy; 2024 Restaurant Template. All rights reserved.</li>
          <li>
            Design: <a href="http://html5up.net" className="text-white/80 hover:text-white">HTML5 UP</a>
          </li>
          <li>
            Built with <a href="https://nextjs.org" className="text-white/80 hover:text-white">Next.js</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}