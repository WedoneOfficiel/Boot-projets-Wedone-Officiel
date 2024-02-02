function checkRefresh()
{
	if (document.refreshForm.visited.value == "")
	{
		console.log("Chargement de la page web...");
	}
	else
	{
		window.location.href = "https://harry-hopkinson.github.io/BookFlix/";
	}
}