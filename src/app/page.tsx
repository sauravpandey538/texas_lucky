export default function Home() {
  return (
    <div className="flex flex-col  items-center justify-between p-8  gap-10 sm:p-20 font-geist  text-black ">
      {/* Heading Section */}
      <div className="text-left max-w-4xl">
        <h1 className="text-4xl font-bold">
          Designed For Texas College of Management&apos;s Students
        </h1>
        <p className="text-lg text-slate-600 mt-4">
          This website is exclusively for Texas College students. To
          participate, first log in using your LCID number, name, and phone
          number. After verifying your number through otp, simply click the
          &quot;Take Part&quot; button to enter the lucky draw. Every Sunday, a
          winner will be randomly selected and showcased on the website.
          Participation is completely free, so don&apos;t miss out!.
        </p>
      </div>
    </div>
  );
}
