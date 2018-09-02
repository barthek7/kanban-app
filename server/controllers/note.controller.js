import Note from '../models/note';
import Lane from '../models/lane';
import uuid from 'uuid';

export function getSomething(req, res) {
  return res.status(200).end();
}

export function addNote(req, res) {
  const { note, laneId } = req.body;

  if (!note || !note.task || !laneId) {
    res.status(400).end();
  }

  const newNote = new Note({
    task: note.task,
  });

  newNote.id = uuid();
  newNote.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    Lane.findOne({ id: laneId })
      .then(lane => {
        lane.notes.push(saved);
        return lane.save();
      })
      .then(() => {
        res.json(saved);
      })
      .catch((err) => {
        console.warn("Error: ", err);
      });
  });
}

export function deleteNote (req, res) {
  const {note, laneId} = req.body;

  if (!note || !note.id || !laneId) {
    res.status(400).end();
  }

  Lane.findOne({id: laneId})
    .then((lane) => {
      Note.findOne({id: note.id}).exec((err, note) =>{
        if(err) {
          res.status(500).send(err);
        }
        note.remove(()=>{
          res.status(200);
        })
      })
      return lane;
    })
    .then(lane => {
     const newLane = lane.notes.filter(laneNote => laneNote.id !== note.id );
      lane.notes = newLane;
      return lane.save();
    })
    .then((lane) => {
      res.json(lane);
    })
    .catch((err) => {
      console.warn("Error: ", err);
    });
    
}

export function changeNoteTask(req, res){
  const {note} = req.body;
  const newTask = note.task;
   if(!note || !note.id || !note.task) {
     res.status(400).end();
   }
  Note.findOne({id: note.id}).exec((err, foundNote) => {
    if(err) {
      res.status(500).end();
    }
    foundNote.task = newTask;
    foundNote.save(()=>{
      res.status(200);
    });
    return foundNote; 
  })
  .then((note) => {
    res.json(note);
  })
  .catch((err) => {
    console.warn("Error: ". err);
  })
}