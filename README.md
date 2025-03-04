<h1 align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:FF5733,100:FFC300&height=215&section=header&fontColor=ffffff&text=Station Météo 🌦️"/>
</h1>

## Introductory diagram
<p align="center">
    <img src="images/station.png" alt="illustration" width="600"/>
</p>

![Commit Status](https://img.shields.io/github/commit-activity/t/VincentMiras/station-meteo?)
![InfluxDB](https://img.shields.io/badge/InfluxDB-22ADF6?style=flat-square&logo=InfluxDB&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=flat-square&logo=vuedotjs&logoColor=4FC08D)

## Project Overview

This project aims to create a weather station that collects and displays meteorological data. It is hosted on a Raspberry Pi in our classroom with real and fake sensors.
The measures are stored in an InfluxDB database and visualised using a Vue.js frontend. Interoperability is necessary here, each project needs to be able to collect, use and send data to our classmates with similar projects.

## Table of contents
* [Features & Use](#features--use)
* [Possible Improvment](#possible--improvement)

## Features & Use


## Possible Improvment

* The first improvement that could be done is the visual one. By having a more stable color chart, the dashborad would have a greater accessibility and lisibility. Moreover, some charts aren't relevant. An exemple is the radar shape for the position that takes a lot of space for a small variation.

* Then the aggregation of the data on charts is made automatically depending on the time difference between the start and the end. But a option could be added to let the user choose the scale of the aggregation that could affect the speed of the loading but will be more relevant for the user as it will be closer to his wish.

* On the visual sidde again, we could offer a choice for the backgroud map at when it is displayed. This is also link to the possibility of implementing a dark mode to the site making it more pleasant and customizable.

<h1 align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:FF5733,100:FFC300&height=115&reversal=true&section=footer"/>
</h1>