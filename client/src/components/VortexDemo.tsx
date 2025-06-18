import { Vortex } from "./ui/vortex";

export function VortexDemo() {
  return (
    <div className="w-full mx-auto rounded-md  h-[30rem] overflow-hidden">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          Welcome Back
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          Let's make today productive! Discover new skills or guide others on
          their learning path.
        </p>
      </Vortex>
    </div>
  );
}
