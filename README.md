# Profiler for Minigun

Minigun-profiler collects cpu and memory usage of your application running **locally**

## Usage

Enable the plugin by adding it in your test script's `config.plugins` section:

```javascript
{
  "config": {
    // ...
    "plugins": {
      "profiler": {
        "pid": 12345, 
        "interval": 2000 //in miliseconds
      }
    }
  }
  // ...
}
```

**`pid` is required** - run `ps -f | grep node` in your terminal and look for pid of the application that you want to collect data of 
`interval` is optional - default value is 2000 miliseconds

### Collected metrics

In the JSON stats produced by `minigun`, below stats will be included.

```javascript
{
  // ...
  "profiler": {
    "cpu": {
    "min": 5.3,
    "max": 10.7,
    "median": 8.1,
    "p95": 10.7,
    "p99": 10.7
  },
  "memory": {
    "min": 462.25,
    "max": 462.25,
    "median": 462.25,
    "p95": 462.25,
    "p99": 462.25
    }
  }
  // ...
}
```


## License

**minigun-plugin-profiler** is distributed under the terms of the
[MIT](https://opensource.org/licenses/MIT) license.