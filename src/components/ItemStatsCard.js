import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

// Utilities
import getCharacteristicImage from "../utility/characteristicsMap";

export default function ItemStatsCard({ item }) {
  return (
    <Box
      sx={{
        // minWidth: 275,
        // width: "40%",
        marginTop: "20px",
        marginLeft: "20px",
        marginRight: "20px",
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
              {item?.effects.map((effect) => (
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
  );
}
