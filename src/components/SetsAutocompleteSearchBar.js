import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function SetsAutocompleteSearchBar({
  v3Data,
  betaData,
  setsNames,
  setSelectedSetV3Data,
  setSelectedSetBetaData,
}) {
  const [selectedSetName, setSelectedSetName] = useState("");
  const [selectedInputSetName, setSelectedInputSetName] = useState("");

  return (
    <Autocomplete
      value={selectedSetName ?? ""}
      onChange={(event, newValue) => {
        setSelectedSetName(newValue);
      }}
      inputValue={selectedInputSetName}
      onInputChange={(event, newInputValue) => {
        setSelectedInputSetName(newInputValue);
        setSelectedSetV3Data(
          v3Data.allSets.find((item) => item.name === newInputValue)
        );
        setSelectedSetBetaData(
          betaData.allSets.find((item) => item.name === newInputValue)
        );
      }}
      disablePortal
      options={setsNames}
      sx={{
        width: 300,
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
        "& .MuiInputBase-input": {
          color: "white",
        },
        "& .MuiFormLabel-root": {
          color: "white",
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={selectedSetName === "" ? "Choose Set" : ""}
        />
      )}
    />
  );
}
