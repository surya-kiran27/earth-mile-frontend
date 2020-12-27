import React from "react";
import {
  Button,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Moment from "react-moment";

const useStyles = makeStyles({
  cardHeaderRoot: {
    overflow: "hidden",
  },
  cardHeaderContent: {
    overflow: "hidden",
  },
});
export default function PostCard(props) {
  const classes = useStyles();

  return (
    <div>
      <Card className="card">
        <CardHeader
          className={{
            root: classes.cardHeaderRoot,
            content: classes.cardHeaderContent,
          }}
          title={props.username}
          subheader={<Moment fromNow date={props.createdAt} />}
        />

        <CardContent
          className={{
            root: classes.cardHeaderRoot,
            content: classes.cardHeaderContent,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {props.title}
          </Typography>
          <Typography noWrap variant="body2" color="textSecondary">
            {props.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">View</Button>
        </CardActions>
      </Card>
    </div>
  );
}
