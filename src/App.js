import logo from "./logo.svg";
import "./App.css";

// React
import { useEffect, useState } from "react";

// Material UI
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

// Components
import Header from "./components/header";

// External Libraries
import axios from "axios";

// Utilities
import getCharacteristicImage from "./utility/characteristicsMap";

// Cancel Axios
let cancelAllEquipmentAxios = null;
let cancelAllResourcesCallAxios = null;

function App() {
  const [allEquipmentData, setAllEquipmentData] = useState([]);
  const [equipmentNames, setEquipmentNames] = useState([]);
  const [selectedEquipmentName, setSelectedEquipmentName] = useState("");
  const [selectedInputEquipmentName, setSelectedInputEquipmentName] =
    useState("");
  const [selectedEquipmentData, setSelectedEquipmentData] = useState(null);
  const [allResourcesData, setAllResourcesData] = useState([]);

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
          cancelAllEquipmentAxios = cancel; // Assign the cancel function to the variable
        }),
      })
      .then(function (response) {
        // handle success
        console.log("success: ", response);

        setAllEquipmentData(response.data.items);
        console.log("Equipment Data: ", response.data.items);
        // Create an array of all the names of the equipment
        const equipmentNamesResponse = response.data.items.map(
          (item) => item.name
        );
        console.log("Equipment Names: ", equipmentNamesResponse);
        setEquipmentNames(equipmentNamesResponse);

        // TODO: Fetch All Resources Data
        axios
          .get(`https://api.dofusdu.de/dofus3/v1/en/items/resources/all`, {
            params: {
              // "filter[min_level]": 190,
              // "filter[max_level]": 200,
              // "filter[type.name_id]": "",
            },
            cancelToken: new axios.CancelToken(function (cancel) {
              cancelAllResourcesCallAxios = cancel;
            }),
          })
          .then(function (response) {
            console.log("success: ", response);
            setAllResourcesData(response.data.items);
          })
          .catch(function (error) {
            console.log("error: ", error);
          });

        // End Fetch All Resources Data
      })
      .catch(function (error) {
        // handle error
        console.log("error: ", error);
      });

    // Cleanup function to cancel the request if the component unmounts
    return () => {
      if (cancelAllEquipmentAxios) {
        cancelAllEquipmentAxios(
          "Request canceled due to component unmounting."
        );
      }
      if (cancelAllResourcesCallAxios) {
        cancelAllResourcesCallAxios(
          "Request canceled due to component unmounting."
        );
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
          {selectedEquipmentName}
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
            value={selectedEquipmentName ?? ""}
            onChange={(event, newValue) => {
              setSelectedEquipmentName(newValue);
            }}
            inputValue={selectedInputEquipmentName}
            onInputChange={(event, newInputValue) => {
              setSelectedInputEquipmentName(newInputValue);
              setSelectedEquipmentData(
                allEquipmentData.find((item) => item.name === newInputValue)
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
        </div>
        {/* ==== Combo Box Search Section ==== */}

        {/* Item Card */}
        <Box
          sx={{
            // minWidth: 275,
            width: "100%",
            marginTop: "20px",
            boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Card
            variant="outlined"
            sx={{ backgroundColor: "#1a1a1a", color: "white" }}
          >
            <CardContent>
              <div>
                <Typography
                  gutterBottom
                  sx={{ fontSize: 14, color: "lightcyan" }}
                >
                  {selectedEquipmentData?.name}
                </Typography>
                <Typography gutterBottom sx={{ color: "red", fontSize: 12 }}>
                  {selectedEquipmentData?.type?.name}
                </Typography>
                <div>
                  <img
                    src={selectedEquipmentData?.image_urls.sd}
                    alt={selectedEquipmentData?.name}
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
              </div>
              <div>
                <div
                  // variant="body2"
                  sx={{
                    // columnCount: 2, // how many columns
                    columnGap: 2, // space between columns (theme units)
                    // optional: balance content better
                    // columnFill: "auto",
                  }}
                >
                  {selectedEquipmentData?.effects.map((effect) => (
                    // add image for the characteristic

                    <Stack
                      direction="row"
                      spacing={1}
                      key={effect.type.id}
                      style={{
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {String(effect.formatted).length > 50 ? null : (
                        <img
                          src={getCharacteristicImage(effect.type.name)}
                          alt={effect.type.name}
                          style={{ width: "20px", height: "20px" }}
                        />
                      )}

                      <Typography
                        variant="body2"
                        key={effect.type.id}
                        style={{
                          color:
                            String(effect.formatted).length > 50
                              ? "white"
                              : String(effect.formatted).includes("-")
                              ? "lightcoral"
                              : "lightgreen",
                        }}
                      >
                        {effect.formatted}
                      </Typography>
                    </Stack>
                  ))}
                </div>
              </div>
            </CardContent>
            {/* <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions> */}
          </Card>
        </Box>
        {/* ==== Item Card ==== */}

        {/* Recipes Card */}
        <Box
          sx={{
            // minWidth: 275,
            width: "100%",
            marginTop: "20px",
            boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Card
            variant="outlined"
            sx={{ backgroundColor: "#1a1a1a", color: "white" }}
          >
            <CardContent>
              <div>
                <Typography
                  gutterBottom
                  sx={{ fontSize: 14, color: "lightcyan" }}
                >
                  {selectedEquipmentData?.name}
                </Typography>
                <Typography gutterBottom sx={{ color: "red", fontSize: 12 }}>
                  {selectedEquipmentData?.type?.name}
                </Typography>
                <div>
                  <img
                    src={selectedEquipmentData?.image_urls.sd}
                    alt={selectedEquipmentData?.name}
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
              </div>
              <div>
                <div>
                  {selectedEquipmentData?.recipe.map((resource) => {
                    const resourceData = allResourcesData.find(
                      (res) => res.ankama_id === resource.item_ankama_id
                    );
                    return (
                      <Stack
                        direction="row"
                        spacing={1}
                        key={resource?.item_ankama_id}
                        style={{
                          marginBottom: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={resourceData?.image_urls.sd}
                          alt={resourceData?.name}
                          style={{ width: "20px", height: "20px" }}
                        />
                        <Typography variant="body1">
                          {resourceData?.name} x{" "}
                          <span style={{ color: "lightsalmon" }}>
                            {resource.quantity}
                          </span>
                        </Typography>
                      </Stack>
                    );
                  })}
                </div>
              </div>
            </CardContent>
            {/* <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions> */}
          </Card>
        </Box>
        {/* ==== Recipes Card ==== */}
      </Container>
    </div>
  );
}

export default App;
