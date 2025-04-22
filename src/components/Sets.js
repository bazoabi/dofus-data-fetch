// React
import { useState, useEffect } from "react";

// Material UI
import Container from "@mui/material/Container";

// Components
import Header from "./HeaderComponent";
import SetsAutocompleteSearchBar from "./SetsAutocompleteSearchBar";

// External Libraries
import axios from "axios";

// API URL
const Dofus3AllSets = `https://api.dofusdu.de/dofus3/v1/en/sets/all`;
const DofusBetaAllSets = `https://api.dofusdu.de/dofus3beta/v1/en/sets/all`;

function Sets() {
  const [v3Data, setV3Data] = useState({
    allSets: [],
  });
  const [betaData, setBetaData] = useState({
    allSets: [],
  });
  const [setsNames, setSetsNames] = useState([]);
  const [selectedSetV3Data, setSelectedSetV3Data] = useState(null);
  const [selectedSetBetaData, setSelectedSetBetaData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create a cancel token source
    const cancelTokenSource = axios.CancelToken.source();

    // Function to fetch all data
    const fetchAllData = async (setData, allSetsApiURL) => {
      try {
        setLoading(true);

        // Define all API calls with the same cancel token
        const allEquipmentPromise = axios.get(allSetsApiURL, {
          params: {
            "filter[min_highest_equipment_level]": 150,
            "filter[max_highest_equipment_level]": 200,
          },
          cancelToken: cancelTokenSource.token,
        });

        // Wait for all promises to resolve
        const [allSetsResponse] = await Promise.all([allEquipmentPromise]);

        // Check if there are two sets with the same name and different ids, if so, edit their names to include their ids
        const updateNoDuplicateSetsList = allSetsResponse.data.sets.map(
          (set) => {
            const sameNameSets = allSetsResponse.data.sets.filter(
              (s) => s.name === set.name // && s.id !== set.id
            );
            if (sameNameSets.length > 1) {
              console.log("Same Name Sets: ", sameNameSets);
              return {
                ...set,
                name: `${set.name} - (${set.ankama_id})`,
              };
            }
            return set;
          }
        );

        console.log("Filtered Sets: ", updateNoDuplicateSetsList);

        //Update state with all responses
        setData({
          allSets: updateNoDuplicateSetsList,
        });

        console.log("Sets Data: ", updateNoDuplicateSetsList);

        // Create an array of all the names of the equipment
        const setsNamesResponse = updateNoDuplicateSetsList.map(
          (item) => item.name
        );
        console.log("Sets Names: ", setsNamesResponse);
        setSetsNames(setsNamesResponse);
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
    fetchAllData(setV3Data, Dofus3AllSets);

    // Call the fetch function for Beta
    fetchAllData(setBetaData, DofusBetaAllSets);

    // Cleanup function to cancel pending requests when component unmounts
    return () => {
      cancelTokenSource.cancel("Component unmounted");
    };
  }, []);

  return (
    <div className="Sets">
      <Container maxWidth="sm">
        <Header />

        {/* Combo Box Search Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <SetsAutocompleteSearchBar
            v3Data={v3Data}
            betaData={betaData}
            setsNames={setsNames}
            setSelectedSetV3Data={setSelectedSetV3Data}
            setSelectedSetBetaData={setSelectedSetBetaData}
          />
        </div>
        {/* ==== Combo Box Search Section ==== */}
      </Container>
    </div>
  );
}

export default Sets;
