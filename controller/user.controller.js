const Users = require("../models/Users.js")

exports.create = async (req, res) => {

    const body = req.body

    console.log("Im adding a new record")
    if (!body.name || !body.question) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    if (body.user_id) {
        res.status(400).send({ message: "User user_id cann't be specified!" });
        return;
    }

    const user = new Users({
        user_id: body.user_id,
        username: body.username,
        role_id: body.role_id,
        role: body.role,
        points: body.points,
        daily: body.daily,
        consecutive_daily: body.consecutive_daily,
        banned_invitation: body.banned_invitation,
        pending_invitation: body.pending_invitation,
        monthly_invitation: body.monthly_invitation,
        monthly_invitation_current: body.monthly_invitation_current,
        monthly_updated: body.monthly_updated,
        total_invitation: body.total_invitation,
        monthly_points_received: body.monthly_points_received,
        oda_in_name: body.oda_in_name,
        oda_in_name_bonus: body.oda_in_name_bonus,
        consecutive_oda: body.consecutive_oda,
        daily_starred: body.daily_starred,
        invitedBy: body.invitedBy,
        total_daily: body.total_daily,
    });
    user
        .save(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
};

exports.findAll = (req, res) => {
    Users.find({})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({
                    message: err.message || "Some error occurred while retrieving users."
                });
        });
};

exports.findOneUsername = (req, res) => {
    const username = req.params.username;
    var condition = username ? { username: { $regex: new RegExp(username) } } : {};
    Users.find(condition)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found User with username " + username });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving User with username=" + username });
        });
};

exports.findOneUserID = (req, res) => {
    const user_id = req.params.user_id;
    Users.findOne({ "user_id": user_id })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found User with user_id " + user_id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving User with user_id=" + user_id });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const user_id = req.params.user_id;
    Users.findOneAndUpdate({ "user_id": user_id }, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update User with user_id=${user_id}. Maybe Users was not found!`
                });
            } else res.send({ message: "Users was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Users with user_id=" + user_id
            });
        });
};

exports.delete = (req, res) => {
    const user_id = req.params.user_id;
    Users.findOneAndRemove({ "user_id": user_id })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete User with user_id=${user_id}. Maybe User was not found!`
                });
            } else {
                res.send({
                    message: "User was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with user_id=" + user_id
            });
        });
};