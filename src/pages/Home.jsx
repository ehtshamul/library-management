import Footer from "../components/Footer";
import Nav from "../components/Nav";

export default function Home() {


  return (
    <div className=" bg-slate-50">
      <Nav />
    <div className="pt-10 bg-slate-50 flex flex-col items-center px-6 md:px-20 py-10 font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif]">
      {/* Hero Section */}
      

      <div
        className=" flex flex-col items-center justify-center text-center rounded-2xl p-10 md:p-16 bg-cover bg-center bg-no-repeat shadow-md"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuATFJzzDu5JlyjJATSwkYz4ecVg-Gt9lQvR53Re9mc6smuQhJmo19vFBaTXSjQHABHvp_dUwGaRg9uiNtGdZm5qsumpypxDDAQJ1GqTyfO8wV9_Oz3Kicxjqy_P9BZ-DcWTIkdTlNOEl8UIZXwFGlSgfcjRY5rf8SP2CnIJoEC6acb67Zp0tAFJEWL9UWpq5mSTnbijSW4WE2uAg_EvPBOZDwPt2b3rLIu5nGQG8b72xMAjT0lQ3jaRFR3cQh-eWpsIb_OIJgIKrW--')",
        }}
      >
        <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          Your Library, Reviews & More
        </h1>
        <p className="text-white text-base md:text-lg max-w-2xl mb-6">
          Discover, review, and manage your library books with ease. Connect
          with fellow readers and explore new literary worlds.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition">
          Browse Books
        </button>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl w-full mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Key Features
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Explore the core functionalities that make our library system stand
            out.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <div className="text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63Z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Review System
            </h3>
            <p className="text-gray-600 text-sm">
              Share your thoughts and insights on books you’ve read. Rate books,
              write detailed reviews, and engage with other readers.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <div className="text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M231.65,194.55,198.46,36.75a16,16,0,0,0-19-12.39L132.65,34.42a16.08,16.08,0,0,0-12.3,19l33.19,157.8A16,16,0,0,0,169.16,224a16.25,16.25,0,0,0,3.38-.36l46.81-10.06A16.09,16.09,0,0,0,231.65,194.55Z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Borrow & Return
            </h3>
            <p className="text-gray-600 text-sm">
              Easily borrow and return books. Track due dates and manage your
              library account efficiently.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <div className="text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38Z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Analytics
            </h3>
            <p className="text-gray-600 text-sm">
              Gain insights into your reading habits. Track progress, favorite
              genres, and authors you explore.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-4xl mt-20 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Ready to Dive In?
        </h2>
        <p className="text-gray-600 mt-2">
          Join our community of book lovers and start exploring today!
        </p>
        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition">
          Get Started
        </button>
      </div>
    
    </div>
      <Footer/>
    </div>
  );
}
