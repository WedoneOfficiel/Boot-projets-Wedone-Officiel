        // Sélectionner les éléments du DOM
        const folderInput = document.getElementById("folder-input");
        const addFolder = document.getElementById("add-folder");
        const folderContainer = document.getElementById("folder-container");
        const taskInput = document.getElementById("task-input");
        const addTask = document.getElementById("add-task");
        const taskList = document.getElementById("task-list");
        const exportBtn = document.getElementById("export");
        const importFile = document.getElementById("import-file");

        // Créer un objet pour stocker les données de la to do list
        let data = {
            folders: [], // un tableau de dossiers, chaque dossier contient un nom et un tableau de tâches
            selectedFolder: null // le nom du dossier actuellement sélectionné
        };

        // Créer une fonction pour sauvegarder les données dans le localStorage
        function saveData() {
            localStorage.setItem("wedone-data", JSON.stringify(data));
        }

        // Créer une fonction pour charger les données depuis le localStorage
        function loadData() {
            let storedData = localStorage.getItem("wedone-data");
            if (storedData) {
                data = JSON.parse(storedData);
                renderFolders();
                renderTasks();
            }
        }

        // Créer une fonction pour ajouter un dossier
        function addFolderToList(name) {
            // Vérifier si le nom est valide et n'existe pas déjà
            if (name && !data.folders.some(folder => folder.name === name)) {
                // Créer un objet dossier avec un nom et un tableau de tâches vide
                let folder = {
                    name: name,
                    tasks: []
                };
                // Ajouter le dossier au tableau de dossiers
                data.folders.push(folder);
                // Sauvegarder les données
                saveData();
                // Afficher les dossiers
                renderFolders();
            }
        }

        // Créer une fonction pour supprimer un dossier
        function removeFolderFromList(name) {
            // Trouver l'index du dossier à supprimer
            let index = data.folders.findIndex(folder => folder.name === name);
            // Vérifier si l'index est valide
            if (index !== -1) {
                // Supprimer le dossier du tableau de dossiers
                data.folders.splice(index, 1);
                // Si le dossier supprimé était le dossier sélectionné, mettre à null le dossier sélectionné
                if (data.selectedFolder === name) {
                    data.selectedFolder = null;
                }
                // Sauvegarder les données
                saveData();
                // Afficher les dossiers et les tâches
                renderFolders();
                renderTasks();
            }
        }

        // Créer une fonction pour modifier un dossier
        function editFolderInList(oldName, newName) {
            // Vérifier si le nouveau nom est valide et n'existe pas déjà
            if (newName && !data.folders.some(folder => folder.name === newName)) {
                // Trouver l'index du dossier à modifier
                let index = data.folders.findIndex(folder => folder.name === oldName);
                // Vérifier si l'index est valide
                if (index !== -1) {
                    // Modifier le nom du dossier dans le tableau de dossiers
                    data.folders[index].name = newName;
                    // Si le dossier modifié était le dossier sélectionné, mettre à jour le dossier sélectionné
                    if (data.selectedFolder === oldName) {
                        data.selectedFolder = newName;
                    }
                    // Sauvegarder les données
                    saveData();
                    // Afficher les dossiers et les tâches
                    renderFolders();
                    renderTasks();
                }
            }
        }

        // Créer une fonction pour sélectionner un dossier
        function selectFolderInList(name) {
            // Vérifier si le nom est valide
            if (name) {
                // Mettre à jour le dossier sélectionné
                data.selectedFolder = name;
                // Sauvegarder les données
                saveData();
                // Afficher les dossiers et les tâches
                renderFolders();
                renderTasks();
            }
        }

        // Créer une fonction pour afficher les dossiers
        function renderFolders() {
            // Vider le conteneur des dossiers
            folderContainer.innerHTML = "";
            // Parcourir le tableau de dossiers
            for (let folder of data.folders) {
                // Créer un élément div pour représenter le dossier
                let folderDiv = document.createElement("div");
                folderDiv.classList.add("folder");
                // Ajouter la classe selected si le dossier est le dossier sélectionné
                if (folder.name === data.selectedFolder) {
                    folderDiv.classList.add("selected");
                }
                // Créer un élément i pour l'icône du dossier
                let folderIcon = document.createElement("i");
                folderIcon.classList.add("fas", "fa-folder");
                // Créer un élément span pour le nom du dossier
                let folderName = document.createElement("span");
                folderName.textContent = folder.name;
                // Ajouter les éléments i et span au div du dossier
                folderDiv.appendChild(folderIcon);
                folderDiv.appendChild(folderName);
                // Ajouter un écouteur d'événement click sur le div du dossier
                folderDiv.addEventListener("click", function() {
                    // Sélectionner le dossier cliqué
                    selectFolderInList(folder.name);
                });
                // Ajouter un écouteur d'événement contextmenu (clic droit) sur le div du dossier
                folderDiv.addEventListener("contextmenu", function(e) {
                    // Empêcher l'action par défaut du navigateur (afficher le menu contextuel)
                    e.preventDefault();
                    // Demander à l'utilisateur s'il veut modifier ou supprimer le dossier
                    let choice = prompt(`Que voulez-vous faire avec le dossier ${folder.name} ?\nEntrez M pour modifier ou S pour supprimer.`);
                    // Si l'utilisateur a entré M, demander le nouveau nom du dossier et appeler la fonction pour modifier le dossier
                    if (choice === "M") {
                        let newName = prompt(`Entrez le nouveau nom du dossier ${folder.name} :`);
                        editFolderInList(folder.name, newName);
                    }
                    // Si l'utilisateur a entré S, demander confirmation et appeler la fonction pour supprimer le dossier
                    if (choice === "S") {
                        let confirm = prompt(`Êtes-vous sûr de vouloir supprimer le dossier ${folder.name} ?\nEntrez OUI pour confirmer ou NON pour annuler.`);
                        if (confirm === "OUI") {
                            removeFolderFromList(folder.name);
                        }
                    }
                });
                // Ajouter le div du dossier au conteneur des dossiers
                folderContainer.appendChild(folderDiv);
            }
        }

               // Créer une fonction pour ajouter une tâche
                function addTaskToList(name) {
            // Vérifier si le nom est valide et si un dossier est sélectionné
            if (name && data.selectedFolder) {
                // Trouver le dossier sélectionné dans le tableau de dossiers
                let folder = data.folders.find(folder => folder.name === data.selectedFolder);
                // Créer un objet tâche avec un nom et un statut (fait ou non)
                let task = {
                    name: name,
                    done: false
                };
                // Ajouter la tâche au tableau de tâches du dossier sélectionné
                folder.tasks.push(task);
                // Sauvegarder les données
                saveData();
                // Afficher les tâches
                renderTasks();
            }
        }

        // Créer une fonction pour supprimer une tâche
        function removeTaskFromList(name) {
            // Vérifier si le nom est valide et si un dossier est sélectionné
            if (name && data.selectedFolder) {
                // Trouver le dossier sélectionné dans le tableau de dossiers
                let folder = data.folders.find(folder => folder.name === data.selectedFolder);
                // Trouver l'index de la tâche à supprimer dans le tableau de tâches du dossier sélectionné
                let index = folder.tasks.findIndex(task => task.name === name);
                // Vérifier si l'index est valide
                if (index !== -1) {
                    // Supprimer la tâche du tableau de tâches du dossier sélectionné
                    folder.tasks.splice(index, 1);
                    // Sauvegarder les données
                    saveData();
                    // Afficher les tâches
                    renderTasks();
                }
            }
        }
        

        // Créer une fonction pour modifier une tâche
        function editTaskInList(oldName, newName) {
            // Vérifier si le nouveau nom est valide et si un dossier est sélectionné
            if (newName && data.selectedFolder) {
                // Trouver le dossier sélectionné dans le tableau de dossiers
                let folder = data.folders.find(folder => folder.name === data.selectedFolder);
                // Trouver l'index de la tâche à modifier dans le tableau de tâches du dossier sélectionné
                let index = folder.tasks.findIndex(task => task.name === oldName);
                // Vérifier si l'index est valide
                if (index !== -1) {
                    // Modifier le nom de la tâche dans le tableau de tâches du dossier sélectionné
                    folder.tasks[index].name = newName;
                    // Sauvegarder les données
                    saveData();
                    // Afficher les tâches
                    renderTasks();
                }
            }
        }

        // Créer une fonction pour marquer une tâche comme faite ou non
        function toggleTaskStatus(name) {
            // Vérifier si le nom est valide et si un dossier est sélectionné
            if (name && data.selectedFolder) {
                // Trouver le dossier sélectionné dans le tableau de dossiers
                let folder = data.folders.find(folder => folder.name === data.selectedFolder);
                // Trouver l'index de la tâche à marquer dans le tableau de tâches du dossier sélectionné
                let index = folder.tasks.findIndex(task => task.name === name);
                // Vérifier si l'index est valide
                if (index !== -1) {
                    // Inverser le statut de la tâche dans le tableau de tâches du dossier sélectionné
                    folder.tasks[index].done = !folder.tasks[index].done;
                    // Sauvegarder les données
                    saveData();
                    // Afficher les tâches
                    renderTasks();
                }
            }
        }

        // Créer une fonction pour afficher les tâches
        function renderTasks() {
            // Vider la liste des tâches
            taskList.innerHTML = "";
            // Vérifier si un dossier est sélectionné
            if (data.selectedFolder) {
                // Trouver le dossier sélectionné dans le tableau de dossiers
                let folder = data.folders.find(folder => folder.name === data.selectedFolder);
                // Parcourir le tableau de tâches du dossier sélectionné
                for (let task of folder.tasks) {
                    // Créer un élément li pour représenter la tâche
                    let taskLi = document.createElement("li");
                    // Ajouter la classe done si la tâche est marquée comme faite
                    if (task.done) {
                        taskLi.classList.add("done");
                    }
                    // Créer un élément input de type checkbox pour le statut de la tâche
                    let taskCheckbox = document.createElement("input");
                    taskCheckbox.type = "checkbox";
                    taskCheckbox.checked = task.done;
                    // Ajouter un écouteur d'événement change sur l'input checkbox
                    taskCheckbox.addEventListener("change", function() {
                        // Marquer la tâche comme faite ou non selon l'état du checkbox
                        toggleTaskStatus(task.name);
                    });
                    // Créer un élément span pour le nom de la tâche
                    let taskName = document.createElement("span");
                    taskName.textContent = task.name;
                    // Ajouter un écouteur d'événement contextmenu (clic droit) sur le span du nom de la tâche
                    taskName.addEventListener("contextmenu", function(e) {
                        // Empêcher l'action par défaut du navigateur (afficher le menu contextuel)
                        e.preventDefault();
                        // Demander à l'utilisateur le nouveau nom de la tâche et appeler la fonction pour modifier la tâche
                        let newName = prompt(`Entrez le nouveau nom de la tâche ${task.name} :`);
                        editTaskInList(task.name, newName);
                    });
                    // Créer un élément i pour l'icône de suppression de la tâche
                    let taskDelete = document.createElement("i");
                    taskDelete.classList.add("fas", "fa-trash-alt");
                    // Ajouter un écouteur d'événement click sur l'icône de suppression
                    taskDelete.addEventListener("click", function() {
                        // Demander confirmation à l'utilisateur et appeler la fonction pour supprimer la tâche
                        let confirm = prompt(`Êtes-vous sûr de vouloir supprimer la tâche ${task.name} ?\nEntrez OUI pour confirmer ou NON pour annuler.`);
                        if (confirm === "OUI") {
                            removeTaskFromList(task.name);
                        }
                    });
                    // Ajouter les éléments input, span et i au li de la tâche
                    taskLi.appendChild(taskCheckbox);
                    taskLi.appendChild(taskName);
                    taskLi.appendChild(taskDelete);
                    // Ajouter le li de la tâche à la liste des tâches
                    taskList.appendChild(taskLi);
                }
            }
        }

        // Créer une fonction pour exporter les données au format JSON
        function exportData() {
            // Créer un élément a pour créer un lien de téléchargement
            let link = document.createElement("a");
            // Définir l'attribut href du lien avec les données au format JSON et le type MIME application/json
            link.href = "data:application/json," + JSON.stringify(data);
            // Définir l'attribut download du lien avec le nom du fichier à télécharger
            link.download = "wedone-data.json";
            // Simuler un clic sur le lien
            link.click();
        }

        // Créer une fonction pour importer les données depuis un fichier JSON
        function importData(file) {
            // Vérifier si le fichier est valide et de type JSON
            if (file && file.type === "application/json") {
                // Créer un objet FileReader pour lire le contenu du fichier
                let reader = new FileReader();
                // Définir une fonction à exécuter lorsque le fichier est lu
                reader.onload = function(e) {
                    // Récupérer le contenu du fichier sous forme de texte
                    let text = e.target.result;
                    // Essayer de convertir le texte en objet JSON
                    try {
                        let importedData = JSON.parse(text);
                        // Vérifier si l'objet JSON contient les propriétés attendues (folders et selectedFolder)
                        if (importedData.hasOwnProperty("folders") && importedData.hasOwnProperty("selectedFolder")) {
                            // Mettre à jour les données avec l'objet JSON importé
                            data = importedData;
                            // Sauvegarder les données
                            saveData();
                            // Afficher les dossiers et les tâches
                            renderFolders();
                            renderTasks();
                        } else {
                            // Afficher un message d'erreur si l'objet JSON n'est pas valide
                            alert("Le fichier JSON n'est pas valide.");
                        }
                    } catch (error) {
                        // Afficher un message d'erreur si la conversion du texte en objet JSON échoue
                        alert("Le fichier JSON n'est pas valide.");
                    }
                };
                

            //Lire le fichier comme du texte
            reader.readAsText(file);
            } else {
                // Afficher un message d'erreur si le fichier n'est pas de type JSON
                alert("Le fichier n'est pas de type JSON.");
            }
        }

        // Ajouter un écouteur d'événement click sur le bouton pour ajouter un dossier
        addFolder.addEventListener("click", function() {
            // Récupérer la valeur de l'input du nom du dossier
            let folderName = folderInput.value;
            // Appeler la fonction pour ajouter un dossier
            addFolderToList(folderName);
            // Vider l'input du nom du dossier
            folderInput.value = "";
        });

        // Ajouter un écouteur d'événement click sur le bouton pour ajouter une tâche
        addTask.addEventListener("click", function() {
            // Récupérer la valeur de l'input du nom de la tâche
            let taskName = taskInput.value;
            // Appeler la fonction pour ajouter une tâche
            addTaskToList(taskName);
            // Vider l'input du nom de la tâche
            taskInput.value = "";
        });

        // Ajouter un écouteur d'événement click sur le bouton pour exporter les données
        exportBtn.addEventListener("click", function() {
            // Appeler la fonction pour exporter les données
            exportData();
        });

        // Ajouter un écouteur d'événement change sur l'input de type file pour importer les données
        importFile.addEventListener("change", function() {
            // Récupérer le premier fichier sélectionné par l'utilisateur
            let file = this.files[0];
            // Appeler la fonction pour importer les données
            importData(file);
        });

        // Charger les données au chargement de la page
        loadData();