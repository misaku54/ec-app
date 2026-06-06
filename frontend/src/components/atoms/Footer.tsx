export const Footer = () => {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-700 w-full">
      <div className="container px-6 py-4 mx-auto flex items-center sm:flex-row flex-col">
        <p className="text-xs text-zinc-500 sm:ml-0 sm:mt-0 mt-4 tracking-wide">
          © 2025 EC App. All rights reserved —
          <a
            href="https://twitter.com/knyttneve"
            rel="noopener noreferrer"
            className="text-zinc-400 ml-1 hover:text-white transition-colors"
            target="_blank"
          >
            @misaku
          </a>
        </p>
      </div>
    </footer>
  );
};
