import Image from "next/image";
import Hasnat from "@/public/Hasnat.svg";
import Weathery from "@/public/Weathery.svg";

const Navbar = () => {
  return (
    <div className=" bg-background h-24 border-[#E8E1D6] border-b-2 flex items-center justify-between xs:justify-start  text-[#] text-lg md:px-20 xs:px-10">
      <button className="w-fit h-full flex items-center" onClick={() => window.location.reload()}>
        <Image src={Weathery} alt="Weathery" className=" w-80 h-80  cursor-pointer" />
      </button>
      <a href="https://www.linkedin.com/in/hasnat-fahim/" target="_blank" className="xs:w-1/3 flex justify-end">
        <Image
          src={Hasnat}
          alt="Hasnat"
          className="h-16 w-16 hover:scale-105  text-white transition duration-100 ease-in ml-4 xs:ml-0"
        />
      </a>
    </div>
  );
};

export default Navbar;
