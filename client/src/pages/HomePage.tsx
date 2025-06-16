import Header from "@/components/Header";
import { GlobeDemo } from "@/components/World";

const HomePage = () => {
  return (
    <main className="bg-black min-h-screen text-white flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex justify-between items-center flex-1 max-w-[88rem] max-sm:flex-col max-sm:gap-8">
          <div>
            <h1 className="sm:text-8xl text-6xl font-bold">Welcome To </h1>
            <h1 className="sm:text-8xl text-6xl font-bold text-[#fe6a00]">
              Learnlink
            </h1>
            <p className="mt-4 sm:ml-4 text-gray-400">
              Modern and reliable online learning platform.
            </p>
          </div>
          <div className="sm:size-[600px] size-[380px]">
            <GlobeDemo />
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
