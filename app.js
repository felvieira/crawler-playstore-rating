const puppeteer = require('puppeteer')

let scrape = async (user, pass) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  // const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage()
  await page.goto("https://play.google.com/store/apps/details?id=br.com.personalvirtual&showAllReviews=true");
  await page.click('.XnFhVd span')

  document.querySelectorAll('div[jscontroller=H6eOGe] div[jscontroller=LVJlx] span')[0].innerHTML;

  await page.waitForNavigation()

  // await page.click('#profile-nav-item');

  // const btnComprarID = await page.evaluate(() => {
  // 	return document.querySelector('.box_botao > a').getAttribute(data-id);
  // });



  await page.goto(
    `https://www.kabum.com.br/cgi-local/site/carrinho/adicionar.cgi?codigo=${code}`
  )
  await page.goto(
    'https://www.kabum.com.br/cgi-local/site/carrinho/carrinho.cgi'
  )

  let botaoMaisResenha = document.querySelectorAll('button.LkLjZd.ScJHi.OzU4dc');
  botaoMaisResenha.forEach(item => {
    item.click();
  });

  const qualificacao = await page.evaluate(() => {
    let all = document.querySelectorAll('div[jscontroller=H6eOGe]');
    let qualificacaoContainer = [];
    let positivas = [];
    let negativas = [];
   
    [].forEach.call(all, function (item) {
      if (item.querySelector('div > div:nth-child(2) div[aria-label *= Avaliado]')
        .getAttribute('aria-label')
        .match(/(4 de 5|5 de 5)/)) {
        positivas.push({
          name: `${
            item.querySelector("div > div:nth-child(2) span").innerText
          }`,
          avaliacao: `${item
            .querySelector(
              "div > div:nth-child(2) div[aria-label *= Avaliado]"
            )
            .getAttribute("aria-label")}`,
          img: `${item
            .querySelector("div > div img")
            .getAttribute("src")}`,
          txt: `${
            item
              .querySelector("div[jscontroller = LVJlx] span")
              .innerText.includes("Resenha")
            ? item.querySelector(
              "div[jscontroller = LVJlx] span[jsname = fbQN7e]"
            ).innerText
            : item.querySelector("div[jscontroller = LVJlx] span")
              .innerText
          }`
        });
      } else {
        negativas.push({
          name: `${item.querySelector('div > div:nth-child(2) span').innerText}`,
          avaliacao: `${item.querySelector('div > div:nth-child(2) div[aria-label *= Avaliado]').getAttribute('aria-label')}`,
          img: `${item.querySelector('div > div img').getAttribute('src')}`,
          txt: `${
            item
              .querySelector("div[jscontroller = LVJlx] span")
              .innerText.includes("Resenha")
              ? item.querySelector(
                "div[jscontroller = LVJlx] span[jsname = fbQN7e]"
              ).innerText
              : item.querySelector("div[jscontroller = LVJlx] span")
                .innerText
            }`
        })
      }
    });
    qualificacaoContainer = [{ positivas: [...positivas] }, { negativas: [...negativas] }];
    return qualificacaoContainer;
  })

  console.log(frete)
  await page.goto('https://www.kabum.com.br/cgi-local/site/caixa/pagamento.cgi')


  await page.evaluate(() => {
    document.querySelector('form[name="pagamento_boleto"] input[name="BOLETO"]')
      .click()
  })

  await page.waitForNavigation();

  await page.evaluate(() => {
    return document.querySelector('span.confirmacao-negrito')
      .click()
    // document.querySelector('input[name="CONFIRMACAO"]').click();
  })

  // 	const form = await page.$('form[name="pagamento-boleto"]');
  // await form.evaluate(form => form.submit());

  // Pegar Link do Perfil
  // const profileLink = await page.evaluate(() => {
  // 	return document.querySelector('a.nav-settings__view-profile-link')
  // 		.href
  // });

  // // await page.evaluate(() => {
  // //   document.querySelector('a.nav-settings__view-profile-link').click();
  // // })

  // await page.goto(profileLink)

  // await page.waitForSelector('.pv-top-card-section__name')

  // // Clicar Exibir Mais Resumo
  // const resumeMany = await page.evaluate(() => {
  // 	return document.querySelector('.pv-top-card-section__summary-toggle-button')
  // });
  // if (resumeMany) {
  // 	await page.click('.pv-top-card-section__summary-toggle-button');
  // };

  // // Clicar Exibir Mais Jobs
  // const moreJob = await page.evaluate(() => {
  // 	return document.querySelector('#experience-section .pv-experience-section__see-more')
  // });
  // if (moreJob) {
  // 	await page.click('#experience-section .pv-experience-section__see-more > button');
  // 	await page.waitFor(3000);
  // };

  // // Clicar Exibir Mais Skills
  // const moreSkils = await page.evaluate(() => {
  // 	return document.querySelector('.pv-skill-categories-section button.pv-profile-section__card-action-bar')
  // });
  // if (moreSkils) {
  // 	await page.click('.pv-skill-categories-section button.pv-profile-section__card-action-bar');
  // 	await page.waitFor(3000);
  // };

  // // Clicar Exibir Mais Detalhes Jobs
  // await Promise.all([
  // 		page.evaluate(() => {
  // 			let x = document.querySelectorAll('#experience-section .pv-entity__extra-details a.lt-line-clamp__more');
  // 			x.forEach((el) => el.click())
  // 		})
  // 	])
  // 	.catch(e => console.log(e));

  // await page.waitFor(5000)

  // // Scrape
  // const result = await page.evaluate(() => {
  // 	NodeList.prototype.forEach = Array.prototype.forEach;

  // 	const imgProfile = document.querySelector('button.profile-photo-edit__edit-btn > img')
  // 		.src;
  // 	const name = document.querySelector('.pv-top-card-section__name')
  // 		.innerText || '';
  // 	const job = document.querySelector('.pv-top-card-section__headline')
  // 		.innerText || '';
  // 	const city = document.querySelector('.pv-top-card-section__location')
  // 		.innerText || '';
  // 	const resume = (document.querySelector('.pv-top-card-section__summary-text')
  // 			.innerText)
  // 		.replace(/\n/g, '') || '';

  // 	// Jobs
  // 	const jobPositionsNoMore = document.querySelectorAll('#experience-section .pv-profile-section__section-info.section-info.pv-profile-section__section-info--has-no-more > li, #experience-section .pv-profile-section__section-info.section-info.pv-profile-section__section-info--has-no-more > div');
  // 	const jobsPositionsMore = document.querySelectorAll('#experience-section .pv-profile-section__section-info.section-info.pv-profile-section__section-info--has-more > li, #experience-section .pv-profile-section__section-info.section-info.pv-profile-section__section-info--has-more > div');
  // 	const jobsPositions = jobPositionsNoMore.length > 0 ? jobPositionsNoMore : jobsPositionsMore;
  // 	let expecJobs = [];
  // 	jobsPositions.forEach((expec) => {
  // 		const position = expec.querySelector('.pv-entity__summary-info > h3')
  // 			.innerText || '';
  // 		const enterprise = expec.querySelector('.pv-entity__summary-info .pv-entity__secondary-title')
  // 			.innerText || '';
  // 		const data = expec.querySelector('.pv-entity__summary-info .pv-entity__date-range > span:last-child')
  // 			.innerText || '';
  // 		const range = expec.querySelector('.pv-entity__summary-info .pv-entity__bullet-item-v2')
  // 			.innerText || '';
  // 		const details = expec.querySelector('.pv-entity__extra-details > p') ? expec.querySelector('.pv-entity__extra-details > p')
  // 			.innerText.replace(/Visualizar menos/g, '') : '';

  // 		const template = {
  // 			position: `${position}`,
  // 			enterprise: `${enterprise}`,
  // 			data: `${data}`,
  // 			range: `${range}`,
  // 			details: `${details.replace(/\n/g, '')}`
  // 		}

  // 		expecJobs.push(template)
  // 	});

  // 	// Educational
  // 	let educationalSkills = [];
  // 	const educationalItem = document.querySelectorAll('#education-section ul > li.pv-education-entity') || '';
  // 	if (educationalItem) {
  // 		educationalItem.forEach((item) => {
  // 			const educationalEnterprise = item.querySelector('h3.pv-entity__school-name')
  // 				.innerText;
  // 			const educationalName = item.querySelector('.pv-entity__secondary-title > span.pv-entity__comma-item')
  // 				.innerText;
  // 			const educationalData = item.querySelector('.pv-entity__dates > span:last-child')
  // 				.innerText;
  // 			const educationalResume = (item.querySelector('.pv-entity__description')
  // 					.innerText)
  // 				.replace(/\n/g, '');

  // 			const template = {
  // 				educationalEnterprise: `${educationalEnterprise}`,
  // 				educationalName: `${educationalName}`,
  // 				educationalData: `${educationalData}`,
  // 				educationalResume: `${educationalResume}`
  // 			}

  // 			educationalSkills.push(template)

  // 		})
  // 	}

  // 	// Skills
  // 	let skillsOpen = [];
  // 	const skillsOpenEach = () => {
  // 		document.querySelectorAll('ol.pv-skill-category-list__skills_list > li > div > p')
  // 			.forEach((item) => skillsOpen.push(item.innerText))
  // 	};
  // 	skillsOpenEach();

  // 	// Imagens de Trabalhos
  // 	let imgJobs = [];
  // 	const imgJobsEach = () => {
  // 		document.querySelectorAll('a.pv-treasury-list-preview__treasury-item-link')
  // 			.forEach((item) => {
  // 				item.click();
  // 				setTimeout(() => {
  // 					imgJobs.push(document.querySelector('.pv-treasury-media-viewer img')
  // 						.src);
  // 					document.querySelector('#li-modal-container .button.close')
  // 						.click();
  // 				}, 3000);

  // 				// imgJobs.push(item.style.backgroundImage.replace('url(','').replace(/["']/g, ""))
  // 			})
  // 	};
  // 	imgJobsEach();

  // 	let skillsTec = [];

  // 	const cv = {
  // 		imgProfile: `${imgProfile}`,
  // 		name: `${name}`,
  // 		job: `${job}`,
  // 		city: `${city}`,
  // 		resume: `${resume}`,
  // 		jobs: { ...expecJobs },
  // 		educational: { ...educationalSkills },
  // 		skillsOpen: skillsOpen,
  // 		imgJobs: imgJobs
  // 	};

  // return cv;

  // });

  browser.close()

  // return result
}

scrape()
