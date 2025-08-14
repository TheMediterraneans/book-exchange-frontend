import { Link } from "react-router-dom"

function Footer() {
    return (
        <footer className="footer pt-3 pb-4 px-4 text-base-content border-t border-base-300 fixed bottom-0 left-0 right-0 z-50 shadow-lg backdrop-blur-sm bg-base-100/95 text-base">
            <div className="relative flex w-full items-center bg-gray-800/60">
                <div className="pl-4">


                    <Link to="/about">
                        <p className="text-base">About</p>
                    </Link>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 text-center">
                    <a
                        href="https://github.com/TheMediterraneans/book-exchange-frontend"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-hover text-base"
                    >
                        GitHub
                    </a>
                    <p className="text-base">All rights reserved ©</p>
                </div>
                <div className="pr-4 text-right ml-auto">
                    <p className="text-base">Made with ❤️ by <span className="text-red-500">Zefi & Luana</span></p>
                </div>
            </div>
        </footer>
    )
}

export default Footer