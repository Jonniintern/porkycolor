import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useWallet from "../contexts/WalletContext";
import { PORKY_POLICY_ID } from "../constants";

const colors = {
  default: "white",
  color01: "#dad827",
  color02: "#27da93",
  color03: "#da5b27",
  color04: "#27a0da",
  color05: "#da274d",
  color06: "#da27cd",
};

function Page() {
  const router = useRouter();
  const {
    query: { porky_number: porkyNumber },
  } = router;

  const { connected, populatedWallet } = useWallet();

  const [thisPorky, setThisPorky] = useState({});
  const [porkyJsonFile, setPorkyJsonFile] = useState({});
  const [selectedValues, setSelectedValues] = useState([]);
  const [renderedImage, setRenderedImage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchJsonFile = async (_num) => {
    try {
      const { data } = await axios.get(
        `https://tmo-test.azurewebsites.net/api/v1/porkyisland/layergenerator/porkyisland${_num}/layeroptions`
      );

      return data;
    } catch (error) {
      console.error(error.message);
    }
  };

  const renderImage = async (_num, _layers) => {
    setLoading(true);
    toast.loading("Rendering...");

    try {
      const res = await fetch(
        `https://tmo-test.azurewebsites.net/api/v1/porkyisland/layergenerator/porkyisland${_num}/render`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectKey: "PORKYISLAND",
            layers: _layers,
          }),
        }
      );

      const reader = new FileReader();

      reader.addEventListener("load", () => {
        const dataBase64 = reader.result;
        setRenderedImage(dataBase64);
        toast.dismiss();
        toast.success("Rendered!");
      });

      reader.readAsDataURL(await res.blob());
    } catch (error) {
      console.error(error.message);
      toast.dismiss();
      toast.error("Failed!");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (porkyNumber) {
      fetchJsonFile(porkyNumber).then((data) => {
        setPorkyJsonFile(data);

        const _selectedValues = data.standardPfp.layers;
        const _optionValues = data.variationOptions.layers;

        const selectedIdx = _selectedValues.findIndex(
          (obj) => obj.traitName === "background"
        );

        if (selectedIdx !== -1) {
          _selectedValues[selectedIdx].variant = _optionValues
            .filter((obj) => obj.traitName === "background")[0]
            ?.variants.filter((str) => str !== "default")[0];
        }

        setSelectedValues(_selectedValues);
        renderImage(porkyNumber, _selectedValues);
      });
    }

    if (connected) {
      setThisPorky(
        populatedWallet.assets[PORKY_POLICY_ID].find(
          (porky) => porky.assetName.split("#")[1] === porkyNumber
        )
      );
    }
  }, [porkyNumber, connected]);

  const download = () => {
    const a = document.createElement("a");
    a.href = renderedImage;
    a.innerText = `Porky #${porkyNumber}`;
    a.download = `Porky #${porkyNumber}`;
    a.click();
  };

  return (
    <div>
      <button onClick={() => router.push("/")}>return</button>
      <div className="generatorContainer">
        <div className="pickerContainer" style={{ display: "flex" }}>
          <img
            src={renderedImage || thisPorky.assetImage}
            alt={porkyNumber}
            width={500}
            height={500}
            style={{ backgroundColor: "black" }}
          />

          <div className="colorPicker">
            <div>
              {porkyJsonFile.variationOptions?.layers.map(
                ({ traitName, variants }) =>
                  traitName !== "background" ? (
                    <div
                      className="traitName"
                      key={`trait_category_${traitName}`}
                    >
                      <span>{traitName}</span>

                      <div>
                        {variants.map((str) =>
                          str !== "default" ? (
                            <button
                              className="colorPick"
                              key={`trait_category_${traitName}_varient_${str}`}
                              style={{
                                padding: "5px",

                                width: "1.5rem",
                                height: "1.5rem",
                                backgroundColor: colors[str],
                                border:
                                  selectedValues.find(
                                    (obj) => obj.traitName === traitName
                                  )?.variant === str
                                    ? "3px solid white"
                                    : "",
                              }}
                              onClick={() =>
                                setSelectedValues((prev) => {
                                  const copyOfPrev = [...prev];
                                  const foundIdx = copyOfPrev.findIndex(
                                    (obj) => obj.traitName === traitName
                                  );

                                  copyOfPrev[foundIdx].variant = str;

                                  return copyOfPrev;
                                })
                              }
                            />
                          ) : null
                        )}
                      </div>
                    </div>
                  ) : null
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <button
                disabled={loading}
                onClick={() => renderImage(porkyNumber, selectedValues)}
              >
                Render
              </button>
              <button disabled={loading} onClick={() => download()}>
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="infoBox">
          <p className="infoTitle">RIGHT KLIKK SAYVE</p>
        </div>
      </div>
    </div>
  );
}

export default Page;
