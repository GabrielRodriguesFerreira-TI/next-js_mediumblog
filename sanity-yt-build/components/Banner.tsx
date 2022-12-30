import Image from "next/image";

function Banner() {
  return (
    <div className="flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0">
      <div className="px-10 space-y-5">
        <h1 className="text-6xl max-w-xl font-serif">
          <span className="underline decoration-black decoration-4">
            Kenzium
          </span>{" "}
          é um lugar para escrever, ler e conectar
        </h1>
        <h2>
          É fácil e gratuito postar sua opinião sobre qualquer assunto e
          conectar-se com milhões de leitores
        </h2>
      </div>

      <Image className="hidden md:inline-flex h-40 lg:h-full" width={300} height={80} src="/K logo.svg" alt="" />
    </div>
  );
}

export default Banner;
