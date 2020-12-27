import React, { useState } from "react";
import {
  Input,
  Button,
  Container,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Grid,
  TextareaAutosize,
} from "@material-ui/core";
import axios from "axios";

export default function CreatePost(props) {
  console.log(props.earth_mile_id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = React.useState("");
  const handleChange = (event) => {
    setCategory(event.target.value);
  };
  return (
    <div className="wrapper">
      <div className="row">
        <center>
          <Typography display="block" variant="h3" gutterBottom>
            Create Post
          </Typography>
        </center>
      </div>

      <div className="row">
        <Input
          placeholder="Enter Title"
          fullWidth
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>
      <div className="row">
        <Input
          fullWidth
          value={description}
          placeholder="Enter Description"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </div>
      <div className="row">
        <TextareaAutosize
          className="textarea"
          value={body}
          rowsMax={5}
          rowsMin={5}
          placeholder="Enter Body"
          onChange={(e) => {
            setBody(e.target.value);
          }}
        />
      </div>
      <div className="row">
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          fullWidth
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={category}
          onChange={handleChange}
        >
          <MenuItem value={"humans"}>Humans</MenuItem>
          <MenuItem value={"animals"}>Animals</MenuItem>
          <MenuItem value={"environment"}>Environment</MenuItem>
        </Select>
      </div>
      <div className="row">
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={async () => {
            const data = {
              title,
              body,
              description,
              category,
              earth_mile_id: props.earth_mile_id,
            };

            const res = await axios.post(
              "http://localhost:8000/earth-miles/create-post",
              data
            );
            console.log(res);
            if (res.data.success) {
              alert("Post created");
            }
          }}
        >
          Sumbit
        </Button>
      </div>
    </div>
  );
}
