import Lane from '../models/lane';
import Note from '../models/note';
import uuid from 'uuid';

export function getSomething(req, res) {
  return res.status(200).end();
}

export function addLane(req, res) {
  if (!req.body.name) {
    res.status(403).end();
  }

  const newLane = new Lane(req.body);

  newLane.notes = [];

  newLane.id = uuid();
  newLane.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json(saved);
  });
}

export function getLanes(req, res) {
  Lane.find().exec((err, lanes) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ lanes });
  });
}

export function deleteLane(req, res) {
  Lane.findOne({ id: req.params.laneId }).exec((err, lane) => {
    if (err) {
      res.status(500).send(err);
    }
    if(lane.notes.length > 0) {
      for(let note of lane.notes){
        Note.findOne({id: note.id}).exec((err, note) => {
          if(err) {
            res.status(500).send(err);
          }
          note.remove(() => {
            res.status(200);
          });
        });
      }
    }

    lane.remove(() => {
      res.status(200).end();
    });
  });
}

export function updateLaneName(req, res) {
 const {name , id} = req.body;

Lane.findOne({id: id}).exec((err, lane) =>{
  if(err){
    res.status(500).send(err);
  }
  lane.name = name;

  lane.save((err,saved) => {
    if(err) {
      res.status(500).send(err);
    }
    res.json(saved);
  });
});
}