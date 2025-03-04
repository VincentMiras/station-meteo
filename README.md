<h1 align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:FF5733,100:FFC300&height=215&section=header&fontColor=ffffff&text=Weather Station 🌦️"/>
</h1>

## Introductory diagram
<p align="center">
    <img src="images/station.png" alt="illustration" width="600"/>
</p>

![Commit Status](https://img.shields.io/github/commit-activity/t/VincentMiras/station-meteo?)
![InfluxDB](https://img.shields.io/badge/InfluxDB-22ADF6?style=flat-square&logo=InfluxDB&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=flat-square&logo=vuedotjs&logoColor=4FC08D)

## Project Overview

This project aims to create a weather station that collects and displays meteorological data. It is hosted on a **Raspberry Pi** in our classroom with real and fake sensors.
The measures are stored in an InfluxDB database and visualised using a Vue.js frontend. Interoperability is necessary here, each project needs to be able to collect, use and send data to our classmates with similar projects.

## Table of contents
* [Features & Use](#features--use)
* [Possible Improvment](#possible--improvement)

## Features & Use


Thanks to our project, you can visit our website to see and observe the weather **all over the world**. All you have to do is type [http://piensg031.ensg.eu:3000/](http://piensg031.ensg.eu:3000/) into your browser. When you land on the home page, you can choose to access either **live view** measurements or some data for the period you want to observe through **sample view**.

### Live View
Here you can view live data, select the measurements and stations you wish to view and the most recent data will be displayed on the screen. You will also see a map showing the location of the station if you choose to see it.

### Sample View
This section allows you to select a specific time period to view historical data. You can filter the data by date and time to analyse past weather conditions. The data is presented as graphs, and by selecting multiple stations you can view data from the same sensors on a unique graph.

## Possible Improvment


<h1 align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:FF5733,100:FFC300&height=115&reversal=true&section=footer"/>
</h1>