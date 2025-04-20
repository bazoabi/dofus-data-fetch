import logo from "./logo.svg";
import "./App.css";

// React
import { useEffect, useState } from "react";

// Material UI
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

// Components
import Header from "./components/header";

// External Libraries
import axios from "axios";

// Cancel Axios
let cancelAxios = null;

function App() {
  const [equipmentNames, setEquipmentNames] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedInputEquipment, setSelectedInputEquipment] = useState("");

  // Fetch data from the API
  useEffect(() => {
    // Fetch data from the API
    axios
      .get(`https://api.dofusdu.de/dofus3/v1/en/items/equipment/all`, {
        params: {
          "filter[min_level]": 190,
          "filter[max_level]": 200,
          "filter[type.name_id]":
            "Hat,Cloak,Amulet,Ring,Belt,Boots,Dagger,Sword,Staff,Hammer,Bow,Shield",
        },

        cancelToken: new axios.CancelToken(function (cancel) {
          // An executor function receives a cancel function as a parameter
          cancelAxios = cancel; // Assign the cancel function to the variable
        }),
      })
      .then(function (response) {
        // handle success
        console.log("success: ", response);

        // Create an array of all the names of the equipment
        const equipmentNamesResponse = response.data.items.map(
          (item) => item.name
        );
        console.log("Equipment Names: ", equipmentNamesResponse);
        setEquipmentNames(equipmentNamesResponse);
      })
      .catch(function (error) {
        // handle error
        console.log("error: ", error);
      });

    // Cleanup function to cancel the request if the component unmounts
    return () => {
      if (cancelAxios) {
        cancelAxios("Request canceled due to component unmounting.");
      }
    };
  }, []);

  return (
    <div className="App">
      <Container maxWidth="sm">
        <Header />

        {/* Show Selected Equipment Name Label */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            marginBottom: "20px",
            color: "white",
          }}
        >
          {selectedEquipment}
        </div>
        {/* ==== Show Selected Equipment Name Label ==== */}

        {/* Combo Box Search Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Autocomplete
            value={selectedEquipment ?? ""}
            onChange={(event, newValue) => {
              setSelectedEquipment(newValue);
            }}
            inputValue={selectedInputEquipment}
            onInputChange={(event, newInputValue) => {
              setSelectedInputEquipment(newInputValue);
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
                label={selectedEquipment === "" ? "Equipment" : ""}
              />
            )}
          />
        </div>
        {/* ==== Combo Box Search Section ==== */}
      </Container>
    </div>
  );
}

export default App;
