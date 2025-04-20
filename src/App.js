import logo from "./logo.svg";
import "./App.css";

// Material UI
import Container from "@mui/material/Container";

// Components
import Header from "./components/header";

// External Libraries
import axios from "axios";
import { useEffect } from "react";

// Cancel Axios
let cancelAxios = null;

function App() {
  // Fetch data from the API
  useEffect(() => {
    // Fetch data from the API
    axios
      .get(`https://api.dofusdu.de/dofus3/v1/en/items/equipment/all`, {
        params: {
          "filter[min_level]": 190,
          "filter[max_level]": 200,
        },

        cancelToken: new axios.CancelToken(function (cancel) {
          // An executor function receives a cancel function as a parameter
          cancelAxios = cancel; // Assign the cancel function to the variable
        }),
      })
      .then(function (response) {
        // handle success
        console.log("success: ", response);
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
      </Container>
    </div>
  );
}

export default App;
