import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function AutocompleteSearchBar({
  v3Data,
  betaData,
  equipmentNames,
  setSelectedEquipmentV3Data,
  setSelectedEquipmentBetaData,
}) {
  const [selectedEquipmentName, setSelectedEquipmentName] = useState("");
  const [selectedInputEquipmentName, setSelectedInputEquipmentName] =
    useState("");

  return (
    <Autocomplete
      value={selectedEquipmentName ?? ""}
      onChange={(event, newValue) => {
        setSelectedEquipmentName(newValue);
      }}
      inputValue={selectedInputEquipmentName}
      onInputChange={(event, newInputValue) => {
        setSelectedInputEquipmentName(newInputValue);
        setSelectedEquipmentV3Data(
          v3Data.allEquipment.find((item) => item.name === newInputValue)
        );
        setSelectedEquipmentBetaData(
          betaData.allEquipment.find((item) => item.name === newInputValue)
        );
      }}
      disablePortal
      options={equipmentNames}
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
          label={selectedEquipmentName === "" ? "Equipment" : ""}
        />
      )}
    />
  );
}
