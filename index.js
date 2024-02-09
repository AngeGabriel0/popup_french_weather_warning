
//TODO :
//1. Récupérer les données de l'API Vigilance Météo France (https://portail-api.meteofrance.fr/web/fr/api/test/ed0ad072-a309-4d13-b518-df4e9f8dbbea/25dfaee7-2d0a-434b-a743-272a861d01f0)


//Token valable jusqu'au 08/03/2023
const token = 'eyJ4NXQiOiJOelU0WTJJME9XRXhZVGt6WkdJM1kySTFaakZqWVRJeE4yUTNNalEyTkRRM09HRmtZalkzTURkbE9UZ3paakUxTURRNFltSTVPR1kyTURjMVkyWTBNdyIsImtpZCI6Ik56VTRZMkkwT1dFeFlUa3paR0kzWTJJMVpqRmpZVEl4TjJRM01qUTJORFEzT0dGa1lqWTNNRGRsT1RnelpqRTFNRFE0WW1JNU9HWTJNRGMxWTJZME13X1JTMjU2IiwidHlwIjoiYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI4OThmNDU0Yy0wZTdhLTRiNDAtYWMzNS1jNzkxOTRiYzM0ZWMiLCJhdXQiOiJBUFBMSUNBVElPTiIsImF1ZCI6IlRpeGUwNkVqd0VVWU55SnljSDR4TDlwSTNmSWEiLCJuYmYiOjE3MDc0MzYzODksImF6cCI6IlRpeGUwNkVqd0VVWU55SnljSDR4TDlwSTNmSWEiLCJzY29wZSI6ImRlZmF1bHQiLCJpc3MiOiJodHRwczpcL1wvcG9ydGFpbC1hcGkubWV0ZW9mcmFuY2UuZnJcL29hdXRoMlwvdG9rZW4iLCJleHAiOjE3MDc0Mzk5ODksImlhdCI6MTcwNzQzNjM4OSwianRpIjoiNmQ1OGNiYjktOGZiYy00YWNhLWEzMWYtZThjNmU0NmEyZjBjIiwiY2xpZW50X2lkIjoiVGl4ZTA2RWp3RVVZTnlKeWNINHhMOXBJM2ZJYSJ9.CcCrlQdSiR4diFc8fV25LNgX-0EfB7T9j_LRsCal56OqXQdMQiKckchd64phK3QGpz4y4KH58wEoEK0R80g6HVzu_x6imMmH-6iNM0uXkB9prd0o2ntOPyxQFDl1cpohm8Lvnwk2eGOcA5ETZex5FDU1WoeRLO-QtWhu-_X7eLRVU69UYqURzkPxhCkZJNe-x8EbIIGeqbwOd-KDnNMn8J1QtCKb80uQN8ZIACLIn60V_kQYe7kJBPwkY5FNvgjPky3_Wcgo0NeZBAw9v5ioO0bpgUHVxcO_eFqOovus6HrPBRCSno01AF3nm3bFWaDabVv_g-ltdAMyLOid6H3uWQ';

//connection à l'api avec le token d'authentification


fetch('https://public-api.meteofrance.fr/public/DPVigilance/v1/cartevigilance/encours', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})
    .then((response) => {
        return response.json();
    })
    .then((data) => {

        window.onload = function () {
            if (Notification.permission === 'granted') {
                Notification.requestPermission();
            }
        }

        
        //Créer une fonction qui va récupérer les données de l'API toutes les 5 secondes
        setTimeout(function () {

            for (let i = 0; i < data.product.periods[0].timelaps.domain_ids.length; i++) {
                const targetDomainIds = ['59']; //Départements ciblés
                const currentDomainId = data.product.periods[0].timelaps.domain_ids[i].domain_id;
                const phenomena = data.product.periods[0].per_phenomenon_items[1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9].phenomenon_id;
                

                if (targetDomainIds.includes(currentDomainId)) {
                    var dpt = data.product.periods[0].timelaps.domain_ids[i].domain_id //Récupérer le numéro du département
                    var meteoAlert = data.product.periods[0].timelaps.domain_ids[i].max_color_id //Récupérer le niveau d'alerte météo
                    
                    var meteoAlerts = {
                        1: 'Pas d\'alerte en cours',
                        2: 'alerte jaune en cours',
                        3: 'alerte orange en cours',
                        4: 'alerte rouge en cours'
                    };

                    var phenomenaDescriptions = {
                        1: 'Vent violent',
                        2: 'Pluie-inondation',
                        3: 'Orages',
                        4: 'Crues',
                        5: 'Neige-verglas',
                        6: 'Canicule',
                        7: 'Grand froid',
                        8: 'Avalanches',
                        9: 'Vagues-submersion'
                    };

                    
                    var alerte = meteoAlerts[meteoAlert]; //Récupérer la description de l'alerte météo
                    var phenomenaDescriptions = phenomenaDescriptions[phenomena]; //Récupérer la description du phénomène météo

                    let notification = new Notification("Vigilance", {
                        body: `Vigilance météo en cours dans le département ${dpt} : ${alerte} (${phenomenaDescriptions}). \n Pour plus d'informations, cliquez pour consulter le site de Météo France. `,
                    });

                    setTimeout(function () {
                        notification.close();
                    }, 5000);

                    //Redirection vers le site de Météo France, puis notification fermée
                    notification.onclick = function () {
                        window.open(`https://vigilance.meteofrance.fr/fr/nord`);
                        notification.close();
                    };
                }

            }


        }, 5000);
    })

    .catch((err) => {
        console.log(err)
        console.log('Erreur lors de la récupération des données');
    })


//Idées d'amélioration :
//1. Mettre les noms de départements en clair (ex : 59 = Nord / 62 = Pas-de-Calais..)
//2. Inclure les phénomènes météo (vent violent, pluie-inondation, orages, neige-verglas, canicule, grand froid, avalanches, vagues-submersion)
//3. Inclure les DROM (Réunion, Mayotte, Martinique, Guadeloupe, Guyane)
//4. Faire en sorte que la notification ne s'affiche que lorsque la vigilance évolue (ex : vigilance jaune -> vigilance orange, ou inversement) --> while + stocker 2 variables (vigilance actuelle et vigilance suivante)
