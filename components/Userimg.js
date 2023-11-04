import Image from 'next/image';

export default function Userimg({ img }) {
  return (
    <div className="border-none w-44 h-44 m-auto">
      <Image src={img} alt="The Registrar" width={160} height={160} />
    </div>
  );
}
