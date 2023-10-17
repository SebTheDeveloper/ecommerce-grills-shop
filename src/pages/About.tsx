import { useEffect } from "react";
import { LogoTitle } from "../components/LogoTitle";

export function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: "70vh" }} className="fade-in" id="about">
      <LogoTitle />
      <div className="text-content">
        <p>
          At Palm Beach Custom Grillz, excellence is our promise. We're
          dedicated to delivering top-tier grillz without breaking the bank.
        </p>
        <p>
          With a spectrum spanning from NPG to luxurious 18K Gold, our
          custom-fitted grillz cater to every style.
        </p>
        <p>
          From timeless classics to daring fangs and beyond, our collection
          offers a plethora of choices.
        </p>
        <p>
          We believe in lasting impressions, which is why our deep cuts come
          standard, ensuring a permanent and flawless look, all at no extra
          cost.
        </p>
        <p>
          While our prices remain competitive, compromising on quality is not an
          option. Trust us to craft your grillz to perfection the first time at
          Palm Beach Custom Grillz.
        </p>
      </div>
    </div>
  );
}
