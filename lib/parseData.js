var fs = require('fs'),
    rs = fs.createReadStream('./data/csv/pokemon.csv'),
    Converter = require('csvtojson').Converter,
    convertNames = new Converter(),
    convertIds = new Converter();

var pokemonNames = {},
    pokemonIds = {};

convertNames.on('end_parsed', function () {
  fs.writeFile('./dist/pokemon-by-name.json', JSON.stringify(pokemonNames));
});

convertNames.on('record_parsed', function (resultRow) {
  var name = resultRow.identifier;
  delete resultRow.identifier;
  resultRow.name = name;
  if (resultRow.species_id < 650) {
    resultRow.sprites = {
      normal: 'http://img.pokemondb.net/sprites/black-white/normal/' + name + '.png',
      animated: 'http://img.pokemondb.net/sprites/black-white/anim/normal/' + name + '.gif'
    };
  } else {
    resultRow.sprites = {
      normal: 'http://img.pokemondb.net/sprites/x-y/normal/' + name + '.png'
    };
  }
  pokemonNames[name] = resultRow;
});

convertIds.on('end_parsed', function () {
  fs.writeFile('./dist/pokemon-by-id.json', JSON.stringify(pokemonIds));
});

convertIds.on('record_parsed', function (resultRow) {
  var id = resultRow.id,
      name = resultRow.identifier;
  delete resultRow.identifier;
  resultRow.name = name;
  if (resultRow.species_id < 650) {
    resultRow.sprites = {
      normal: 'http://img.pokemondb.net/sprites/black-white/normal/' + name + '.png',
      animated: 'http://img.pokemondb.net/sprites/black-white/anim/normal/' + name + '.gif'
    };
  } else {
    resultRow.sprites = {
      normal: 'http://img.pokemondb.net/sprites/x-y/normal/' + name + '.png'
    };
  }
  pokemonIds[id] = resultRow;
});

rs.pipe(convertNames);
rs.pipe(convertIds);
