import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product'
import Image from '#models/image'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { Readable } from 'node:stream'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const games = [
      {
        title: 'Elden Ring',
        description:
          'Levante-se, Maculado, e seja guiado pela graça para portar o poder do Anel Prístino e se tornar um Lorde Prístino nas Terras Intermédias.',
        price: 229.9,
        developer: 'FromSoftware Inc.',
        publisher: 'Bandai Namco Entertainment',
        genre: 'RPG, Ação',
        release_date: '2022-02-25',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
      },
      {
        title: 'Cyberpunk 2077',
        description:
          'Cyberpunk 2077 é um RPG de ação e aventura em mundo aberto que se passa em Night City, uma megalópole perigosa onde todos são obcecados por poder, glamour e biomodificações.',
        price: 199.9,
        developer: 'CD PROJEKT RED',
        publisher: 'CD PROJEKT RED',
        genre: 'RPG, Mundo Aberto',
        release_date: '2020-12-10',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
      },
      {
        title: 'Red Dead Redemption 2',
        description:
          'Arthur Morgan e a gangue Van der Linde são forçados a fugir. Com agentes federais e os melhores caçadores de recompensas no seu encalço, a gangue precisa roubar, assaltar e lutar para sobreviver.',
        price: 299.9,
        developer: 'Rockstar Games',
        publisher: 'Rockstar Games',
        genre: 'Ação, Aventura',
        release_date: '2019-12-05',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg',
      },
      {
        title: "Baldur's Gate 3",
        description:
          'Reúna seu grupo e volte aos Reinos Esquecidos em uma história de amizade e traição, sacrifício e sobrevivência, e o fascínio do poder absoluto.',
        price: 199.99,
        developer: 'Larian Studios',
        publisher: 'Larian Studios',
        genre: 'RPG, Estratégia',
        release_date: '2023-08-03',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg',
      },
      {
        title: 'God of War',
        description:
          'Com a vingança contra os deuses do Olimpo em um passado distante, Kratos agora vive como um mortal no reino dos deuses e monstros nórdicos.',
        price: 199.9,
        developer: 'Santa Monica Studio',
        publisher: 'PlayStation PC LLC',
        genre: 'Ação, Aventura',
        release_date: '2022-01-14',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg',
      },
      {
        title: 'Stardew Valley',
        description:
          'Você herdou a antiga fazenda do seu avô em Stardew Valley. Armado com ferramentas de segunda mão e algumas moedas, você parte para começar sua nova vida.',
        price: 24.99,
        developer: 'ConcernedApe',
        publisher: 'ConcernedApe',
        genre: 'Simulação, RPG',
        release_date: '2016-02-26',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg',
      },
      {
        title: 'Hollow Knight',
        description:
          'Forje seu próprio caminho em Hollow Knight! Uma aventura de ação épica através de um vasto reino arruinado de insetos e heróis.',
        price: 46.99,
        developer: 'Team Cherry',
        publisher: 'Team Cherry',
        genre: 'Metroidvania, Ação',
        release_date: '2017-02-24',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg',
      },
      {
        title: 'Resident Evil 4',
        description:
          'A sobrevivência é apenas o começo. Seis anos se passaram desde o desastre biológico em Raccoon City. Leon S. Kennedy, um dos sobreviventes, foi enviado para resgatar a filha do presidente.',
        price: 249.0,
        developer: 'CAPCOM Co., Ltd.',
        publisher: 'CAPCOM Co., Ltd.',
        genre: 'Ação, Terror',
        release_date: '2023-03-24',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg',
      },
      {
        title: 'Grand Theft Auto V',
        description:
          'Quando um malandro de rua, um ladrão de bancos aposentado e um psicopata aterrorizante se envolvem com o submundo do crime, eles precisam realizar uma série de golpes para sobreviver.',
        price: 109.89,
        developer: 'Rockstar North',
        publisher: 'Rockstar Games',
        genre: 'Ação, Mundo Aberto',
        release_date: '2015-04-14',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg',
      },
      {
        title: 'Terraria',
        description:
          'Cave, lute, explore, construa! Nada é impossível neste jogo de aventura cheio de ação. O mundo é sua tela e o solo é sua tinta.',
        price: 19.99,
        developer: 'Re-Logic',
        publisher: 'Re-Logic',
        genre: 'Aventura, Sandbox',
        release_date: '2011-05-16',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg',
      },
      {
        title: 'The Witcher 3: Wild Hunt',
        description:
          'Você é Geralt de Rívia, mercenário matador de monstros. O mundo está em guerra e você precisa encontrar a Criança da Profecia.',
        price: 99.99,
        developer: 'CD PROJEKT RED',
        publisher: 'CD PROJEKT RED',
        genre: 'RPG, Mundo Aberto',
        release_date: '2015-05-18',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
      },
      {
        title: 'DOOM Eternal',
        description:
          'Os exércitos do inferno invadiram a Terra. Torne-se o Slayer em uma campanha épica para um jogador e conquiste demônios através das dimensões.',
        price: 149.0,
        developer: 'id Software',
        publisher: 'Bethesda Softworks',
        genre: 'Ação, FPS',
        release_date: '2020-03-20',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/782330/header.jpg',
      },
      {
        title: 'Hades',
        description:
          'Desafie o deus dos mortos enquanto você batalha para sair do Submundo neste roguelike dungeon crawler dos criadores de Bastion e Transistor.',
        price: 73.99,
        developer: 'Supergiant Games',
        publisher: 'Supergiant Games',
        genre: 'Roguelike, Ação',
        release_date: '2020-09-17',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg',
      },
      {
        title: 'Sekiro: Shadows Die Twice',
        description:
          'Explore o Japão do final dos anos 1500 Sengoku, um período brutal de conflito constante de vida e morte.',
        price: 274.0,
        developer: 'FromSoftware Inc.',
        publisher: 'Activision',
        genre: 'Ação, Aventura',
        release_date: '2019-03-21',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg',
      },
      {
        title: 'BioShock Infinite',
        description:
          'Endividado com as pessoas erradas e com sua vida em risco, veterano da cavalaria dos EUA e agora arma de aluguel, Booker DeWitt tem apenas uma oportunidade.',
        price: 89.99,
        developer: 'Irrational Games',
        publisher: '2K',
        genre: 'FPS, Ação',
        release_date: '2013-03-25',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/8870/header.jpg',
      },
      {
        title: 'Portal 2',
        description:
          'A "Iniciativa de Teste Perpétuo" foi expandida para permitir que você desenhe quebra-cabeças cooperativos para você e seus amigos!',
        price: 32.99,
        developer: 'Valve',
        publisher: 'Valve',
        genre: 'Puzzle, Aventura',
        release_date: '2011-04-18',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg',
      },
      {
        title: 'Cuphead',
        description:
          'Cuphead é um jogo de ação clássico focado em batalhas contra chefes. Inspirado nas animações da década de 1930.',
        price: 36.9,
        developer: 'Studio MDHR',
        publisher: 'Studio MDHR',
        genre: 'Ação, Plataforma',
        release_date: '2017-09-29',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/268910/header.jpg',
      },
      {
        title: 'Celeste',
        description:
          'Ajude Madeline a enfrentar seus demônios internos em sua jornada até o topo da Montanha Celeste, nesse jogo de plataforma super-preciso.',
        price: 59.99,
        developer: 'Maddy Makes Games',
        publisher: 'Maddy Makes Games',
        genre: 'Plataforma, Indie',
        release_date: '2018-01-25',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/504230/header.jpg',
      },
      {
        title: 'Control',
        description:
          'Após uma agência secreta em Nova York ser invadida por uma ameaça de outro mundo, você se torna a nova Diretora lutando para recuperar o Controle.',
        price: 129.0,
        developer: 'Remedy Entertainment',
        publisher: '505 Games',
        genre: 'Ação, Aventura',
        release_date: '2020-08-27',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/870780/header.jpg',
      },
      {
        title: 'Dark Souls III',
        description:
          'Dark Souls continua a ultrapassar os limites com o mais recente e ambicioso capítulo da série aclamada pela crítica.',
        price: 229.9,
        developer: 'FromSoftware Inc.',
        publisher: 'Bandai Namco Entertainment',
        genre: 'RPG, Ação',
        release_date: '2016-04-11',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg',
      },
      {
        title: 'Dead Cells',
        description:
          'Dead Cells é um jogo de plataforma de ação roguelite estilo Metroidvania. Você vai explorar um castelo extenso e em constante mudança.',
        price: 47.49,
        developer: 'Motion Twin',
        publisher: 'Motion Twin',
        genre: 'Roguelike, Metroidvania',
        release_date: '2018-08-06',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/588650/header.jpg',
      },
      {
        title: 'Forza Horizon 5',
        description:
          'Sua maior aventura Horizon te espera! Explore as paisagens vibrantes e em constante evolução do mundo aberto do México.',
        price: 249.0,
        developer: 'Playground Games',
        publisher: 'Xbox Game Studios',
        genre: 'Corrida, Mundo Aberto',
        release_date: '2021-11-08',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg',
      },
      {
        title: 'Monster Hunter: World',
        description:
          'Bem-vindo ao novo mundo! Assuma o papel de um caçador e mate monstros ferozes em um ecossistema vivo e vibrante.',
        price: 99.9,
        developer: 'CAPCOM Co., Ltd.',
        publisher: 'CAPCOM Co., Ltd.',
        genre: 'Ação, RPG',
        release_date: '2018-08-09',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/582010/header.jpg',
      },
      {
        title: 'Subnautica',
        description:
          'Desça nas profundezas de um mundo subaquático alienígena cheio de maravilhas e perigos. Crie equipamentos, pilote submarinos e seja mais esperto que a vida selvagem.',
        price: 57.99,
        developer: 'Unknown Worlds',
        publisher: 'Unknown Worlds',
        genre: 'Sobrevivência, Mundo Aberto',
        release_date: '2018-01-23',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/264710/header.jpg',
      },
      {
        title: 'The Elder Scrolls V: Skyrim',
        description:
          'Vencedor de mais de 200 prêmios de Jogo do Ano, Skyrim Special Edition traz a fantasia épica à vida com detalhes impressionantes.',
        price: 149.0,
        developer: 'Bethesda Game Studios',
        publisher: 'Bethesda Softworks',
        genre: 'RPG, Mundo Aberto',
        release_date: '2016-10-27',
        image_url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/489830/header.jpg',
      },
    ]

    console.log(`📦 Preparando para cadastrar ${games.length} jogos AAA e Indies...`)

    const uploadPath = app.makePath('tmp/uploads')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }

    for (const game of games) {
      const exists = await Product.findBy('name', game.title)
      if (exists) continue

      console.log(`💾 Salvando: ${game.title}`)

      const product = await Product.create({
        name: game.title,
        description: game.description,
        price: game.price,
        developer: game.developer,
        publisher: game.publisher,
        genre: game.genre,
        release_date: DateTime.fromISO(game.release_date),
      })

      const imageName = `${product.id}_cover.jpg`
      const localImagePath = app.makePath('tmp/uploads', imageName)

      try {
        const imgResponse = await fetch(game.image_url)
        if (!imgResponse.ok) throw new Error(`Falha ao baixar imagem: ${imgResponse.statusText}`)

        const bodyStream = imgResponse.body
        if (!bodyStream) throw new Error('Resposta não contém corpo (body) ao baixar imagem')

        await pipeline(Readable.fromWeb(bodyStream), fs.createWriteStream(localImagePath))

        await Image.create({
          name: imageName,
          productId: product.id,
        })
      } catch (error) {
        console.error(`❌ Erro ao baixar imagem para ${game.title}:`, error.message)
      }
    }

    console.log('✅ Seed concluída com sucesso! Loja "Labor" abastecida.')
  }
}
