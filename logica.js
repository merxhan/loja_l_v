
$(function () {

    $('#carouselSlidesOnly').hide();

    fetch("./employer.json")
        .then((response) => {
            if (response.ok) { return response.json() }
            throw new Error('Error en la consulta de empleados.');
        }).then((data) => {

            let listEmployer = '';
            const today = new Date();

            data.sort((a, b) => a.score - b.score).reverse();
            const percentage = data[0].score;

            if (percentage === 0) {
                data.sort(function (a, b) {
                    if (a.name < b.name)
                        return -1;
                    if (a.name > b.name)
                        return 1;
                    return 0;
                });
            }

            data.map(function (item, index) {

                let secondPercentage = (item.score * 100) / percentage;
                let progressCss = '';
                let styleCss = '';

                let [day, month, year] = item.birthday.split('/')
                const todayIsBirthday = new Date(+year, +month - 1, +day);

                let [day_S, month_S, year_S] = item.seniority.split('/')
                const todaySeniority = new Date(+year_S, +month_S - 1, +day_S);

                var diff = Date.now() - Date.parse(todaySeniority);

                var seconds = Math.floor(diff / 1000),
                    minutes = Math.floor(seconds / 60),
                    hours = Math.floor(minutes / 60),
                    days = Math.floor(hours / 24),
                    months = Math.floor(days / 30),
                    years = Math.floor(days / 365);

                days %= 30;
                months %= 12;

                const seniorityHtml = `
                ${years > 0 ? `Anos: ${years} ` : ''}
                ${months > 0 ? `Meses: ${months} ` : ''}
                ${days > 0 ? `Dias: ${days} ` : ''} `;

                if ((todayIsBirthday.getDate() === today.getDate()) && (todayIsBirthday.getMonth() === today.getMonth())) {
                    $("#birthdayName").text(`Aniversário ${item.name}`);
                    $("#btnAniversario").click();
                }

                if (percentage > 0) {
                    $('#carouselSlidesOnly').show();
                    switch (index) {
                        case 0: progressCss = 'bg-warning'; styleCss = 'background-color: #FFDDA0;'; break;
                        case 1: progressCss = 'bg-dark-subtle'; styleCss = 'background-color: #C0C0C0;'; break;
                        case 2: progressCss = 'bg-danger-subtle'; styleCss = ' background-color: #CD7F32;'; break;
                        default: progressCss = ''; break;
                    }
                }

                listEmployer += index < 10 ? `
                <div class="card w-100 my-4" style='${styleCss}'>
                    <img src="./assest/img/employers/${item.image}" class="card-img-top p-3 rounded-top" alt="img_${item.name}">
                    <div class="card-body text-center">        
                        ${index <= 2 && percentage > 0 ? `<img src="./assest/img/utilities/medalha_${index + 1}.png" style="width:4em" class="winner" alt="medalha_${index + 1}">` : ''} 
                        <div class="accordion accordion-flush" id="accordionFlush">
                            <div class="accordion-item">
                                <h2 class="accordion-header ">
                                    <button class="accordion-button collapsed" style='${styleCss}' type="button" data-bs-toggle="collapse"
                                        data-bs-target="#flush-employer_${index + 1}" aria-expanded="false" aria-controls="flush-employer_${index + 1}">
                                        <h3 class="card-title">${index > 2 ? `# ${index + 1}` : ''} ${item.name}</h3>   
                                    </button>
                                </h2>
                                <div id="flush-employer_${index + 1}" class="accordion-collapse collapse" data-bs-parent="#accordionFlush">
                                    <div class="accordion-body" style='${styleCss}'>
                                        <p><b>${item.store}</b></p>
                                        <p class='my-0'><b>Aniversario:</b> <br> ${item.birthday.substr(0, 5)}</p>
                                        <p class='my-0'><b>Tempo de empresa:</b> <br> ${seniorityHtml}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr>      
                        <div class="progress" role="progressbar" aria-label="1" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="height: 3em">
                            <div class="progress-bar progress-bar-striped ${progressCss} progress-bar-animated" style="width: ${parseFloat(secondPercentage).toFixed(0)}%">
                                <p class="text-center fs-1 mt-3"><strong>${item.score}</strong></p>
                            </div>
                        </div> 
                    </div>
                </div>
                ` : '';

            });

            $("#listEmployer").html(listEmployer);

        }).catch((err) => { console.error(err) });

})