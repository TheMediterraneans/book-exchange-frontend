import { Link } from "react-router-dom"

function Footer() {
    return (
        <footer className="footer py-2 px-4 text-base-content border-t border-base-300 fixed bottom-0 left-0 right-0 z-50 shadow-lg backdrop-blur-sm bg-base-100/95 text-sm">
            <div className="relative flex w-full items-center bg-gray-800/60">
                <div className="pl-4">
                    <section><a href="#" target="blank">Facebook</a></section>
                    <section><a href="#" target="blank">X</a></section>
                    <section><a href="#" target="blank">Instagram</a></section>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 text-center">
                    <a 
                        href="https://github.com/TheMediterraneans/book-exchange-frontend" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="link link-hover text-sm"
                    >
                        GitHub Project Repository
                    </a>
                    <p>All rights reserved</p>
                </div>
                <div className="pr-4 text-right ml-auto">
                    <p>Made with <span className="text-red-500">❤️ by Zefi & Luana</span></p>
                    
                    <Link to="/about">
                    <p>About</p>
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer