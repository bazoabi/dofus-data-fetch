import "../App.css";

// React
import { useEffect, useMemo, useState } from "react";

// Material UI
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TrendingFlatOutlinedIcon from "@mui/icons-material/TrendingFlatOutlined";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

// Components
import Header from "./HeaderComponent";

// External Libraries
import axios from "axios";

// Utilities
// import getCharacteristicImage from "./utility/characteristicsMap";
import AutocompleteSearchBar from "./AutocompleteSearchBar";
import ItemStatsCard from "./ItemStatsCard";
import ItemRecipeCard from "./ItemRecipeCard";

// API URL
const Dofus3AllEquipment = `https://api.dofusdu.de/dofus3/v1/en/items/equipment/all`;
const Dofus3AllResources = `https://api.dofusdu.de/dofus3/v1/en/items/resources/all`;
const Dofus3AllConsumables = `https://api.dofusdu.de/dofus3/v1/en/items/consumables/all`;

const DofusBetaAllEquipment = `https://api.dofusdu.de/dofus3beta/v1/en/items/equipment/all`;
const DofusBetaAllResources = `https://api.dofusdu.de/dofus3beta/v1/en/items/resources/all`;
const DofusBetaAllConsumables = `https://api.dofusdu.de/dofus3beta/v1/en/items/consumables/all`;

function Equipment() {
  const [v3Data, setV3Data] = useState({
    allEquipment: [],
    allResources: [],
    allConsumables: [],
  });
  const [betaData, setBetaData] = useState({
    allEquipment: [],
    allResources: [],
    allConsumables: [],
  });
  const [equipmentNames, setEquipmentNames] = useState([]);
  const [selectedEquipmentV3Data, setSelectedEquipmentV3Data] = useState(null);
  const [selectedEquipmentBetaData, setSelectedEquipmentBetaData] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create a cancel token source
    const cancelTokenSource = axios.CancelToken.source();

    // Function to fetch all data
    const fetchAllData = async (
      setData,
      allEquipmentApiURL,
      allResourcesApiUrl,
      allConsumablesApiUrl
    ) => {
      try {
        setLoading(true);

        // Define all API calls with the same cancel token
        const allEquipmentPromise = axios.get(allEquipmentApiURL, {
          params: {
            "filter[min_level]": 150,
            "filter[max_level]": 200,
            "filter[type.name_id]":
              "Hat,Cloak,Amulet,Ring,Belt,Boots,Dagger,Sword,Staff,Hammer,Bow,Shield",
          },
          cancelToken: cancelTokenSource.token,
        });

        const allResourcesPromise = axios.get(allResourcesApiUrl, {
          cancelToken: cancelTokenSource.token,
        });

        const allConsumablesPromise = axios.get(allConsumablesApiUrl, {
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

    // Call the fetch function for V3
    fetchAllData(
      setV3Data,
      Dofus3AllEquipment,
      Dofus3AllResources,
      Dofus3AllConsumables
    );

    // Call the fetch function for Beta
    fetchAllData(
      setBetaData,
      DofusBetaAllEquipment,
      DofusBetaAllResources,
      DofusBetaAllConsumables
    );

    // Cleanup function to cancel pending requests when component unmounts
    return () => {
      cancelTokenSource.cancel("Component unmounted");
    };
  }, []);

  const recipeDiffArray = useMemo(() => {
    if (!selectedEquipmentV3Data || !selectedEquipmentBetaData) return null;

    // Check if selected equipment has recipe
    if (!selectedEquipmentV3Data.recipe || !selectedEquipmentBetaData.recipe) {
      return null;
    }

    const recipeDiffArr = [];
    for (const v3Resource of selectedEquipmentV3Data.recipe) {
      // Check if the resource exists in the beta recipe
      const betaResource = selectedEquipmentBetaData.recipe.find(
        (betaResource) =>
          betaResource.item_ankama_id === v3Resource.item_ankama_id
      );
      if (betaResource) {
        // If it exists, calculate the difference in quantity
        const diff = betaResource.quantity - v3Resource.quantity;
        recipeDiffArr.push({
          ...v3Resource,
          quantity: diff,
        });
      } else {
        // If it doesn't exist, add the resource with a negative quantity
        recipeDiffArr.push({
          ...v3Resource,
          quantity: 0 - v3Resource.quantity,
        });
      }
    }

    for (const betaResource of selectedEquipmentBetaData.recipe) {
      // Check if the resource exists in the v3 recipe
      const v3Resource = selectedEquipmentV3Data.recipe.find(
        (v3Resource) =>
          v3Resource.item_ankama_id === betaResource.item_ankama_id
      );
      if (!v3Resource) {
        // If it doesn't exist, add the resource with a positive quantity
        recipeDiffArr.push({
          ...betaResource,
          quantity: betaResource.quantity,
        });
      }
    }
    // Filter out the resources with quantity 0
    const filteredRecipeDiffArr = recipeDiffArr.filter(
      (resource) => resource.quantity !== 0
    );

    // Find the name and image of the resource from the allResources, allEquipment, and allConsumables arrays
    // and add it to the resource object
    const filteredRecipeDiffExpandedArr = filteredRecipeDiffArr.map(
      (resource) => {
        let resourceData = betaData.allResources.find(
          (res) => res.ankama_id === resource.item_ankama_id
        );
        if (resourceData === undefined) {
          // try to search for the resource in the allEquipment array
          resourceData = betaData.allEquipment.find(
            (res) => res.ankama_id === resource.item_ankama_id
          );
        }
        if (resourceData === undefined) {
          // try to search for the resource in the allConsumables array
          resourceData = betaData.allConsumables.find(
            (res) => res.ankama_id === resource.item_ankama_id
          );
        }
        return resourceData === undefined
          ? resource
          : { ...resource, ...resourceData };
      }
    );

    console.log("Recipe Diff Array: ", filteredRecipeDiffExpandedArr);
    return filteredRecipeDiffExpandedArr;
  }, [selectedEquipmentV3Data, selectedEquipmentBetaData, betaData]);

  // TODO: Remove ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const sparklingPebblesItemsLists = useMemo(() => {
    if (!selectedEquipmentV3Data || !selectedEquipmentBetaData) return null;

    // Check if selected equipment has recipe
    if (!selectedEquipmentV3Data.recipe || !selectedEquipmentBetaData.recipe) {
      return null;
    }

    // TODO: Look for items that have a resource of id: 12740 at the betaData recipe
    const betaDataItemsWithSparklingPebbles = betaData.allEquipment.filter(
      (item) => {
        return item.recipe?.find(
          (resource) => resource.item_ankama_id === 12740 //29444 radiant pebble //26037 eternal conflict mask //15715vortex wing //sparkling pebble: 12740
        );
      }
    );

    const v3SparklingPebblesItemsList = v3Data.allEquipment.filter((item) => {
      return item.recipe?.find((resource) => resource.item_ankama_id === 12740);
    });

    return {
      beta: betaDataItemsWithSparklingPebbles,
      v3: v3SparklingPebblesItemsList,
    };
  }, [selectedEquipmentV3Data, selectedEquipmentBetaData, betaData, v3Data]);

  // console.log(
  //   "Beta Sparkling Pebbles Items List: ",
  //   sparklingPebblesItemsLists?.beta,
  //   "V3 Sparkling Pebbles Items List: ",
  //   sparklingPebblesItemsLists?.v3
  // );

  // Check what items have sparkling pebbles in their recipe in Beta version, and not in V3 version
  const sparklingPebblesItemsDiffNoV3 = useMemo(() => {
    if (!sparklingPebblesItemsLists) return null;

    const v3ItemsWithSparklingPebbles = sparklingPebblesItemsLists.v3.map(
      (item) => item.name
    );
    const betaItemsWithSparklingPebbles = sparklingPebblesItemsLists.beta.map(
      (item) => item.name
    );

    const diff = betaItemsWithSparklingPebbles.filter(
      (item) => !v3ItemsWithSparklingPebbles.includes(item)
    );

    return diff;
  }, [sparklingPebblesItemsLists]);

  console.log(
    "Sparkling Pebbles Items Diff, Exists in Beta but not in V3: ",
    sparklingPebblesItemsDiffNoV3
  );

  // Check what items have sparkling pebbles in their recipe in V3 version, and not in Beta version

  const sparklingPebblesItemsDiffNoBeta = useMemo(() => {
    if (!sparklingPebblesItemsLists) return null;

    const v3ItemsWithSparklingPebbles = sparklingPebblesItemsLists.v3.map(
      (item) => item.name
    );
    const betaItemsWithSparklingPebbles = sparklingPebblesItemsLists.beta.map(
      (item) => item.name
    );

    const diff = v3ItemsWithSparklingPebbles.filter(
      (item) => !betaItemsWithSparklingPebbles.includes(item)
    );

    return diff;
  }, [sparklingPebblesItemsLists]);

  console.log(
    "Sparkling Pebbles Items Diff, Exists in V3 but not in Beta: ",
    sparklingPebblesItemsDiffNoBeta
  );

  // TODO: Remove ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  return (
    <div className="Equipment">
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
            v3Data={v3Data}
            betaData={betaData}
            equipmentNames={equipmentNames}
            setSelectedEquipmentV3Data={setSelectedEquipmentV3Data}
            setSelectedEquipmentBetaData={setSelectedEquipmentBetaData}
          />
        </div>
        {/* ==== Combo Box Search Section ==== */}
      </Container>

      <Box sx={{ width: "100%" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid size={4}>
            {" "}
            {/* 1: Top Left */}
            <ItemStatsCard item={selectedEquipmentV3Data} />
          </Grid>
          <Grid
            size={4}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1a1a1a",
              marginTop: "20px",
            }}
          >
            {" "}
            {/* 2: Top Middle */}
            <TrendingFlatOutlinedIcon sx={{ fontSize: 400 }} />
          </Grid>
          <Grid size={4}>
            {" "}
            {/* 3: Top Right */}
            <ItemStatsCard item={selectedEquipmentBetaData} />
          </Grid>
          <Grid size={4}>
            {" "}
            {/* 4: Bottom Left */}
            <ItemRecipeCard item={selectedEquipmentV3Data} data={v3Data} />
          </Grid>
          <Grid
            size={4}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1a1a1a",
              marginTop: "20px",
              position: "relative",
            }}
          >
            {" "}
            {/* 5: Bottom Middle */}
            <TrendingFlatOutlinedIcon sx={{ fontSize: 400 }} />
            <Stack
              sx={{
                position: "absolute", // Position this absolutely
                top: "50%", // Center vertically
                left: "50%", // Center horizontally
                transform: "translate(-50%, -50%)", // Adjust for perfect centering
                zIndex: 1, // Make sure it's above the icon
                border: "1px solid rgb(80, 74, 74)",
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
                width: "80%", // Adjust width as needed
                borderRadius: "5px",
                padding: "10px",
                backgroundColor: "rgba(0, 0, 0, 0.45)", // Semi-transparent background
              }}
              divider={
                <Divider
                  flexItem
                  sx={{
                    background: "rgba(80, 74, 74, 0.58)",
                    marginBottom: 2,
                  }}
                />
              }
            >
              {recipeDiffArray?.map((resource) => {
                return (
                  <Stack
                    direction="row"
                    color={"white"}
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
                      src={resource?.image_urls.sd}
                      alt={resource?.name}
                      style={{ width: "20px", height: "20px" }}
                    />
                    <Typography variant="body1">
                      <span
                        style={{
                          color:
                            resource?.quantity > 0
                              ? "lightgreen"
                              : "lightcoral",
                          fontWeight: "bold",
                        }}
                      >
                        {resource?.quantity > 0 ? "+" : ""}
                        {resource?.quantity}
                      </span>{" "}
                      {resource?.name}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Grid>
          <Grid size={4}>
            {" "}
            {/* 5: Bottom Right */}
            <ItemRecipeCard item={selectedEquipmentBetaData} data={betaData} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Equipment;
