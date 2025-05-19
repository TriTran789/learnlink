import Header from "@/components/Header";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <main className="bg-black min-h-screen text-white">
      <Header />
      <Link to="/test">test</Link>
    </main>
  );
};

export default HomePage;
