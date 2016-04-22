# Weather-Forecast-Visualizing

2016-03-14~2016-03-25 In Sogang University

 We implemented a Weather Forecast Visualizing. Main server is implemented with node.js. Database is mySQL and to show curved graph we use google chart. The key feature was JSON. With JSON we can simply draw fantastic graph. And to get a lot of data and also newly measured weather data, approach to www.kma.go.kr which is a site that provide a weather information.
 We cumulate a new data in realtime to mySQL. And with node.js, parse this big data(actually this is not that 'BIG') to use google chart. Using this parser finally we store refined data in mySQL. This refined data is sent to node.js file and we re-produced this data to appropriate(for google chart) JSON format. And finally we draw graph in web site.
