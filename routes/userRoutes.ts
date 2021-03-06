/**
 * Created with JetBrains WebStorm.
 * User: anton.kropp
 * Date: 3/28/13
 * Time: 6:12 PM
 * To change this template use File | Settings | File Templates.
 */

/// <reference path="../def/all.d.ts" />

import db = module("../storage/storageContainer");

import base = module("./requestBase");

export class userRoutes {

    constructor(app:ExpressApplication) {
        var requestUtils = new base.requestBase();

        app.get('/logout', (req:any, res) => {
            req.logout();
            res.redirect('/');
        });

        app.get("/api/users", requestUtils.ensureAuthenticated, (req, res) => {
            res.send(req.user.name);
        });

        app.get("/api/users/:id", requestUtils.ensureAuthenticated, (req, res) => {
            db.userStorage.getUser(req.params.id, (err, foundUser) => res.send(foundUser.toObject()));
        });

        app.get("/api/user/current", requestUtils.ensureAuthenticated, (req, res) => {
            db.userStorage.getTracksForUser(req.user, user => res.send(user.toObject()));
        });

        app.get("/api/usersUnsecure", (req, res) => {
            res.send("unsecure");
        });

        app.get("/api/user/:name/images", requestUtils.ensureAuthenticated, (req, res) => {
            db.userStorage.getUserByUsername(req.params.name, (err, foundUser) => {
                res.render("user.jade", {user: foundUser.toObject()})
            });
        });
    }
}

