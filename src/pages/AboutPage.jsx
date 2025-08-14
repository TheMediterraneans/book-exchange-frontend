function AboutPage() {
  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Header con gradiente */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-transparent"></div>
          <div className="relative px-8 py-16">
            <h1
              className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-orange-700 via-orange-300 to-yellow-400 bg-clip-text text-transparent"
              style={{
                fontFamily: "Sreda, serif",
              }}
            >
              About us
            </h1>
          </div>
        </div>

        {/* Contenuto principale */}
        <div className="px-8 py-12 max-w-4xl mx-auto">
          {/* Storia del team */}
          <div className="mb-12">
            <p 
              className="text-lg leading-relaxed text-gray-300 mb-6 border-l-4 border-orange-600 pl-6"
              style={{ fontFamily: "Sreda, serif" }}
            >
              We are <span className="text-orange-400 font-semibold">Zefi & Luana</span>, and this is our second project for the bootcamp
              Full-stack Web Development Ironhack. Zefi is a Greek digital archivist
              living in Amsterdam since many years (we won't count how many :P)
              learning coding to enhance her skills to be able to improve the way
              digital archives preservation is handled today.
            </p>
            
            <p 
              className="text-lg leading-relaxed text-gray-300 mb-6 border-l-4 border-green-700 pl-6"
              style={{ fontFamily: "Sreda, serif" }}
            >
              Luana is an Italian living in Paris since few years (idem, we won't count the time)
              working in tech as Project Manager and pivoting on a Product
              Management role, she decided to learn coding to better understand the
              work of the teams she collaborates with.
            </p>
          </div>

          {/* Progetto */}
          <div className="mb-12 bg-gradient-to-r from-indigo-900/20 to-green-900/20 p-8 rounded-xl border border-indigo-800/30">
            <h2 className="text-2xl font-bold mb-6 text-orange-300" style={{ fontFamily: "Sreda, serif" }}>
              Our Project
            </h2>
            <p 
              className="text-lg leading-relaxed text-gray-300 mb-6"
              style={{ fontFamily: "Sreda, serif" }}
            >
              This project is all around books and the love for readings that many people share as a passion.
              The idea was to offer a platform to share this passion allowing other
              people borrowing and appreciating the readings of our heart. The hope
              is to fuel the creation of a community of passionate of readings, of
              every genre of books, that take this opportunity to discover new opus
              and discuss about their favourites.
            </p>
          </div>

          {/* Vision */}
          <div className="mb-12 bg-gradient-to-l from-green-900/20 to-orange-900/20 p-8 rounded-xl border border-green-800/30">
            <h2 className="text-2xl font-bold mb-6 text-green-400" style={{ fontFamily: "Sreda, serif" }}>
              Our Vision
            </h2>
            <p 
              className="text-lg leading-relaxed text-gray-300"
              style={{ fontFamily: "Sreda, serif" }}
            >
              This is an MVP that can be largely improved. Our vision for improvements: 
              <span className="text-orange-300"> adding localisation</span> and being
              able to filter available books to borrow around you, 
              <span className="text-green-300"> creating a forum</span> to discuss, 
              <span className="text-indigo-300"> adding books to your favourites</span>, being able to follow
              other users to be updated on their activities, 
              <span className="text-orange-300"> organise events</span>...many
              other possibilities are opened! 
              <span className="text-yellow-400 font-semibold"> Enjoy!</span>
            </p>
          </div>

          {/* Citazioni */}
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-6 rounded-lg border-l-4 border-orange-500 transform hover:scale-105 transition-transform duration-300">
              <blockquote 
                className="text-xl italic text-orange-200 mb-2"
                style={{ fontFamily: "Sreda, serif" }}
              >
                "The more that you read, the more things you will know. The more that
                you learn, the more places you'll go."
              </blockquote>
              <cite className="text-orange-400 font-semibold">— Dr. Seuss</cite>
            </div>

            <div className="bg-gradient-to-r from-green-900/40 to-teal-900/40 p-6 rounded-lg border-l-4 border-green-500 transform hover:scale-105 transition-transform duration-300">
              <blockquote 
                className="text-xl italic text-green-200 mb-2"
                style={{ fontFamily: "Sreda, serif" }}
              >
                "Reading is an exercise in empathy; an exercise in walking in someone
                else's shoes for a while."
              </blockquote>
              <cite className="text-green-400 font-semibold">— Malorie Blackman</cite>
            </div>
          </div>
        </div>

        {/* Footer decorativo */}
        <div className="mt-16 h-2 bg-gradient-to-r from-indigo-600 via-orange-500 to-green-600"></div>
      </div>
    </>
  );
}

export default AboutPage;