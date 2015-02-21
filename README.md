# Satellite Downloader

!**Work in progress**!


A small tool for batch-downloading satellite images from csv data.

#### Installation

First, install all the dependencies:

```
npm install
```

Then, start the app ```npm start``` and visit ```http://localhost:1337```.

#### About

This tool can be used for downloading satellite images from the [google maps static api](https://developers.google.com/maps/documentation/staticmaps/) by giving a dataset with coordinates or places to search for. The images are then rendered as pngs and sent to the user as a zip file.

Inspiration: [Prison Map](http://prisonmap.com/)

#### Todos

- [X] prototype
- [ ] How can we download large datasets without exceeding the API limit? (I added a setTimeout(..., 100) for the moment.)
- [ ] Progressbar (larger datasets take some time to generate)
- [X] Add testdata (List of German Airports)
- [ ] Data Validation
- [ ] Error Messages
- [ ] Example Page, Tutorial
- [ ] Add gulp deploy task
- [ ] Deploy somewhere
