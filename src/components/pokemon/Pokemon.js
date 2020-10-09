import React, { Component } from 'react';
import axios from 'axios';
import { Switch } from 'react-router-dom';

export default class Pokemon extends Component {
    state = {
        name: '',
        pokemonIndex: '',
        imageUrl: '',
        types: [],
        description: '',
        stats: {
            hp: '',
            attack: '',
            defense: '',
            speed: '',
            specialAttack: '',
            specialDefense: ''
        },

        height: '',
        weight: '',
        eggGroup: '',
        abilities: '',
        genderRatioMale: '',
        genderRatioFemale: '',
        evs: '',
        harchSteps: ''
    };

    async componentDidMount(){
        const {pokemonIndex} = this.props.match.params;

        // URL para informacion de pokemon
        const pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/';
        const pokemonSpeciesUrl = 'https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/';

        // Obtener informacion de pokemon
        const pokemonRes = await axios.get(pokemonUrl);
        const name = pokemonRes.data.name;
        const imageUrl = pokemonRes.data.sprites.front_default;

        let[hp, attack, defense, speed, specialAttack, specialDefense] = '';

        pokemonRes.data.stats.map(stat => {
            switch(stat.stat.name){
                case 'hp':
                    hp = stat ['base_stat'];
                    break;

                case 'attack':
                    attack = stat['base_stat'];
                    break;

                case 'defense':
                    defense = stat['base_stat'];
                    break;

                case 'speed':
                    speed = stat['base_stat'];
                    break;

                case 'special-Attack':
                    specialAttack = stat['base_stat'];
                    break;

                case 'special-Defense':
                    specialDefense = stat['base_stat'];
                    break;

            }
        });

        // convertir decimetros a pies... el 0.0001 * 100)/100 es para aproximar a 2 decimales
        const height = 
            Math.round((pokemonRes.data.height * 0.328084 + 0.0001) * 100) / 100;
        
        // convertir a libras
        const weight = 
            Math.round((pokemonRes.data.weight * 0.220462 + 0.0001) * 100) / 100;
        const types = pokemonRes.data.types.map(type => type.type.name);
        const abilities = pokemonRes.data.abilities.map(ability => {
            return ability.ability.name.toLowerCase()
                .split('-')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')
        });
        const evs = pokemonRes.data.stats
        .filter(stat =>{
            if(stat.effort>0){
                return true;
            }
            return false;
        })

        .map( stat => {
            return `${stat.effort} ${stat.stat.name}`
                .toLowerCase()
                .split('-')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');
        })
        .join(',');

        // obtener la descripcion de pokemon, tasa de captura, grupo de huevo, Proporcion de genero, pasos de eclosion.
        await axios.get(pokemonSpeciesUrl).then(res => {
            let description = '';
            res.data.flavor_text_entries.some(flavor=>{
                if(flavor.language.name === 'en'){
                    description = flavor.flavor_text;
                    return;
                }
            });

        const femaleRate = res.data[`gender_rate`];
        const genderRatioFemale = 12.5 * femaleRate;
        const genderRatioMale = 12.5 * (8 - femaleRate);

        const catchRate = Math.round((100/255)* res.data['capture_rate']);
        const eggGroups = res.data['egg_groups'].map(group =>{
            
        })
        });
    }

    render() {
        return (
            <div>
                <h1>
                    {this.state.name}
                </h1>
            </div>
        )
    }
}