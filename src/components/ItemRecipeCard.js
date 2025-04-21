import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export default function ItemRecipeCard({ item, data }) {
  return (
    <Box
      sx={{
        // minWidth: 275,
        // width: "40%",
        marginTop: "20px",
        marginLeft: "20px",
        marginRight: "20px",
        marginBottom: "20px",
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Card
        variant="outlined"
        sx={{ backgroundColor: "#1a1a1a", color: "white" }}
      >
        <CardContent>
          <div>
            <Typography gutterBottom sx={{ fontSize: 14, color: "lightcyan" }}>
              {item?.name}
            </Typography>
            <Typography gutterBottom sx={{ color: "red", fontSize: 12 }}>
              {item?.type?.name}
            </Typography>
            <div>
              <img
                src={item?.image_urls.sd}
                alt={item?.name}
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          </div>
          <div>
            <div>
              {item?.recipe?.map((resource) => {
                let resourceData = data.allResources.find(
                  (res) => res.ankama_id === resource.item_ankama_id
                );
                if (resourceData === undefined) {
                  // try to search for the resource in the allEquipment array
                  resourceData = data.allEquipment.find(
                    (res) => res.ankama_id === resource.item_ankama_id
                  );
                }
                if (resourceData === undefined) {
                  // try to search for the resource in the allConsumables array
                  resourceData = data.allConsumables.find(
                    (res) => res.ankama_id === resource.item_ankama_id
                  );
                }
                return resourceData === undefined ? (
                  <Typography
                    key={resource?.item_ankama_id}
                    variant="body1"
                    style={{ color: "red" }}
                  >
                    {"Unknown Resource"} x{" "}
                    <span style={{ color: "lightsalmon" }}>
                      {resource.quantity}
                    </span>
                  </Typography>
                ) : (
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
  );
}
