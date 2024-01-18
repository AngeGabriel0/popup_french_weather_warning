//But du projet : créer un système d'alerte POP-UP sur ordinateur, prévenant les utilisateurs d'une vigilance météo (jaune, orange, rouge) sur leur département, en précisant le type de phénomène (vent violent, pluie-inondation, orages, neige-verglas, canicule, grand froid, avalanches, vagues-submersion).

//TODO :
//1. Récupérer les données de l'API Vigilance Météo France (https://portail-api.meteofrance.fr/web/fr/api/test/ed0ad072-a309-4d13-b518-df4e9f8dbbea/25dfaee7-2d0a-434b-a743-272a861d01f0)
//2. Les stocker dans une base de données
//3. Créer un système d'alerte (POP-UP)

//Token valable jusqu'au 24/01/2024
const token = 'eyJ4NXQiOiJZV0kxTTJZNE1qWTNOemsyTkRZeU5XTTRPV014TXpjek1UVmhNbU14T1RSa09ETXlOVEE0Tnc9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJBbmdlR2FicmllbEBjYXJib24uc3VwZXIiLCJhcHBsaWNhdGlvbiI6eyJvd25lciI6IkFuZ2VHYWJyaWVsIiwidGllclF1b3RhVHlwZSI6bnVsbCwidGllciI6IlVubGltaXRlZCIsIm5hbWUiOiJEZWZhdWx0QXBwbGljYXRpb24iLCJpZCI6NzU0OSwidXVpZCI6IjI1ZGZhZWU3LTJkMGEtNDM0Yi1hNzQzLTI3MmE4NjFkMDFmMCJ9LCJpc3MiOiJodHRwczpcL1wvcG9ydGFpbC1hcGkubWV0ZW9mcmFuY2UuZnI6NDQzXC9vYXV0aDJcL3Rva2VuIiwidGllckluZm8iOnsiNjBSZXFQYXJNaW4iOnsidGllclF1b3RhVHlwZSI6InJlcXVlc3RDb3VudCIsImdyYXBoUUxNYXhDb21wbGV4aXR5IjowLCJncmFwaFFMTWF4RGVwdGgiOjAsInN0b3BPblF1b3RhUmVhY2giOnRydWUsInNwaWtlQXJyZXN0TGltaXQiOjAsInNwaWtlQXJyZXN0VW5pdCI6InNlYyJ9fSwia2V5dHlwZSI6IlBST0RVQ1RJT04iLCJzdWJzY3JpYmVkQVBJcyI6W3sic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJEb25uZWVzUHVibGlxdWVzVmlnaWxhbmNlIiwiY29udGV4dCI6IlwvcHVibGljXC9EUFZpZ2lsYW5jZVwvdjEiLCJwdWJsaXNoZXIiOiJhZG1pbiIsInZlcnNpb24iOiJ2MSIsInN1YnNjcmlwdGlvblRpZXIiOiI2MFJlcVBhck1pbiJ9XSwiZXhwIjoxNzA2MTEwNTk5LCJ0b2tlbl90eXBlIjoiYXBpS2V5IiwiaWF0IjoxNzA1NTA1Nzk5LCJqdGkiOiIyOTUzNzBkNy00MjY0LTQzMDUtOTg5ZC1hYWM0ZjgyY2RhMzAifQ==.jEER5y1pE5B3IAl2LnSGQ9d2pQ3i4OTkbsWm5PfRJ6emX22tO59RIE77ac-LITylyIr5aVhh6_Y36gsG7EoJ9kKM8Nl4U44j8I1g3jw0kwbN4fhvNSVxSupQanDuljUesBWC1LzqeZEwePQuBvRzjZMkt5gbCcxlS6JP5P8wi1FQ0s8dMqYxtH9P-DfakNeWG6aQE0jJ2c14rdndlQNnXasB7J2kNKdz6sd5c_42H8XKY0br8DyGXbR6T8dnlkltjBmMJv6sX1ed_W7Wg_v0kcuDpjRkVFkmc6epnj95_jouI6Y2qB3vmDuZJvFwgv8HdN3fhewNyuwfvJAntF1vJQ==';

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
        return response.json()
    })
    .then((data) => {
        
        //Créer une fonction qui va récupérer les données de l'API toutes les 2 secondes
        setTimeout(function () {

           for (let i = 0; i < data.product.periods[0].timelaps.domain_ids.length; i++) {
                const targetDomainIds = ['59']; //Départements ciblés
                const currentDomainId = data.product.periods[0].timelaps.domain_ids[i].domain_id;

                if (targetDomainIds.includes(currentDomainId)) {
                    var dpt = data.product.periods[0].timelaps.domain_ids[i].domain_id //Récupérer le numéro du département
                    var meteoAlert = data.product.periods[0].timelaps.domain_ids[i].max_color_id //Récupérer le niveau d'alerte météo
                    var alerte;
                    
                    if (meteoAlert == 1) alerte = 'Pas d\'alerte en cours';
                    if (meteoAlert == 2) alerte = 'alerte jaune en cours';
                    if (meteoAlert == 3) alerte = 'alerte orange en cours';
                    if (meteoAlert == 4) alerte = 'alerte rouge en cours';

                    console.log(`Vigilance météo en cours dans le département ${dpt} : ${alerte}`);

                    //Demander la permission pour afficher une notification quand l'utilisateur appuie sur le bouton "Activer les notifications"

                    Notification.requestPermission(function (result) {
                        console.log('Notification permission result:', result);
                    });

                    let notification = new Notification("Vigilance", {
                        body: `Vigilance météo en cours dans le département ${dpt} : ${alerte}. \n Pour plus d'informations, cliquez pour consulter le site de Météo France. `,
                    });

                    //Redirection vers le site de Météo France, puis notification fermée
                    notification.onclick = function () {
                        window.open(`https://vigilance.meteofrance.fr/fr/nord`);
                        notification.close();
                    };
                }

            }


        }, 2000);
    })

    .catch((err) => {
        console.log(err)
    })


//Idées d'amélioration :
//1. Mettre les noms de départements en clair (ex : 59 = Nord / 62 = Pas-de-Calais..)
//2. Inclure les phénomènes météo (vent violent, pluie-inondation, orages, neige-verglas, canicule, grand froid, avalanches, vagues-submersion)
//3. Inclure les DROM (Réunion, Mayotte, Martinique, Guadeloupe, Guyane)
//4. Faire en sorte que la notification ne s'affiche que lorsque la vigilance évolue (ex : vigilance jaune -> vigilance orange, ou inversement) --> while + stocker 2 variables (vigilance actuelle et vigilance suivante)
