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

import Grid from "@mui/material/Grid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import TrendingFlatOutlinedIcon from "@mui/icons-material/TrendingFlatOutlined";

// Components
import Header from "./components/header";

// External Libraries
import axios from "axios";

// Utilities
// import getCharacteristicImage from "./utility/characteristicsMap";
import AutocompleteSearchBar from "./components/AutocompleteSearchBar";
import ItemStatsCard from "./components/ItemStatsCard";
import ItemRecipeCard from "./components/ItemRecipeCard";

// API URL
const Dofus3AllEquipment = `https://api.dofusdu.de/dofus3/v1/en/items/equipment/all`;
const Dofus3AllResources = `https://api.dofusdu.de/dofus3/v1/en/items/resources/all`;
const Dofus3AllConsumables = `https://api.dofusdu.de/dofus3/v1/en/items/consumables/all`;

// TODO: Add a loading spinner while fetching data
// TODO: Create Resources comparison page

function App() {
  const [data, setData] = useState({
    allEquipment: [],
    allResources: [],
    allConsumables: [],
  });
  const [equipmentNames, setEquipmentNames] = useState([]);
  const [selectedEquipmentData, setSelectedEquipmentData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create a cancel token source
    const cancelTokenSource = axios.CancelToken.source();

    // Function to fetch all data
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Define all API calls with the same cancel token
        const allEquipmentPromise = axios.get(Dofus3AllEquipment, {
          params: {
            "filter[min_level]": 150,
            "filter[max_level]": 200,
            "filter[type.name_id]":
              "Hat,Cloak,Amulet,Ring,Belt,Boots,Dagger,Sword,Staff,Hammer,Bow,Shield",
          },
          cancelToken: cancelTokenSource.token,
        });

        const allResourcesPromise = axios.get(Dofus3AllResources, {
          cancelToken: cancelTokenSource.token,
        });

        const allConsumablesPromise = axios.get(Dofus3AllConsumables, {
          cancelToken: cancelTokenSource.token,
        });

        // Wait for all promises to resolve
        const [
          allEquipmentResponse,
          allResourcesResponse,
          allConsumablesResponse,
        ] = await Promise.all([
          allEquipmentPromise,
          allResourcesPromise,
          allConsumablesPromise,
        ]);

        //Update state with all responses
        setData({
          allEquipment: allEquipmentResponse.data.items,
          allResources: allResourcesResponse.data.items,
          allConsumables: allConsumablesResponse.data.items,
        });

        console.log("Equipment Data: ", allEquipmentResponse.data.items);
        console.log("Resources Data: ", allResourcesResponse.data.items);
        console.log("Consumables Data: ", allConsumablesResponse.data.items);

        // Create an array of all the names of the equipment
        const equipmentNamesResponse = allEquipmentResponse.data.items.map(
          (item) => item.name
        );
        console.log("Equipment Names: ", equipmentNamesResponse);
        setEquipmentNames(equipmentNamesResponse);
      } catch (err) {
        if (axios.isCancel(err)) {
          // Request was cancelled, handle accordingly
          console.log("Request canceled:", err.message);
        } else {
          // Handle other errors
          setError(err.message);
          console.error("Error fetching data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchAllData();

    // Cleanup function to cancel pending requests when component unmounts
    return () => {
      cancelTokenSource.cancel("Component unmounted");
    };
  }, []);

  return (
    <div className="App">
      <Container maxWidth="sm">
        <Header />

        {/* Combo Box Search Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <AutocompleteSearchBar
            data={data}
            equipmentNames={equipmentNames}
            setSelectedEquipmentData={setSelectedEquipmentData}
          />
        </div>
        {/* ==== Combo Box Search Section ==== */}
      </Container>

      <Box sx={{ width: "100%" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid size={5}>
            {" "}
            {/* 1: Top Left */}
            <ItemStatsCard item={selectedEquipmentData} />
          </Grid>
          <Grid
            size={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              color: "#1a1a1a",
              marginTop: "20px",
            }}
          >
            {" "}
            {/* 2: Top Middle */}
            <TrendingFlatOutlinedIcon sx={{ fontSize: 200 }} />
          </Grid>
          <Grid size={5}>
            {" "}
            {/* 3: Top Right */}
            <ItemStatsCard item={selectedEquipmentData} />
          </Grid>
          <Grid size={5}>
            {" "}
            {/* 4: Bottom Left */}
            <ItemRecipeCard item={selectedEquipmentData} data={data} />
          </Grid>
          <Grid
            size={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1a1a1a",
              marginTop: "20px",
            }}
          >
            {" "}
            {/* 5: Bottom Middle */}
            <TrendingFlatOutlinedIcon sx={{ fontSize: 200 }} />
          </Grid>
          <Grid size={5}>
            {" "}
            {/* 5: Bottom Right */}
            <ItemRecipeCard item={selectedEquipmentData} data={data} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default App;
