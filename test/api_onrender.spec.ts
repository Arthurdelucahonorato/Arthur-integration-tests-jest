import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import data from '../data/data.json';

describe('Company', () => {
    const p = pactum;
    const baseUrl = 'https://api-desafio-qa.onrender.com';
    p.request.setDefaultTimeout(30000);

    let idCompanhia = "";
    let idProduto = "";
    let idServico = "";
    let idFuncionario = "";

    it('Criar uma empresa', async () => {
        const response = await p
            .spec()
            .post(`${baseUrl}/company/`)
            .withJson({
                "name": "arthur1",
                "cnpj": "12345678000199",
                "state": "SP",
                "city": "Criciuma",
                "address": "arthur@gmail.com",
                "sector": "trez",
            }).expectStatus(StatusCodes.CREATED)
        idCompanhia = response.body.id;
    });

    it('Não permite criar uma empresa sem cidade no body', async () => {
        const cidade = await p
            .spec()
            .post(`${baseUrl}/company/`)
            .withJson({
                "name": "arthuasd12",
                "cnpj": "12345678000199",
                "state": "SP",
                "address": "arthur@gmail.com",
                "sector": "trez",
            }).expectStatus(StatusCodes.BAD_REQUEST)
    });

    it('Lista uma empresa pelo Id', async () => {
        const result = await p
            .spec()
            .get(`${baseUrl}/company/${idCompanhia}/`)
    });

    it('Não permite criar empresa com um nome ja cadastrado', async () => {
        await p
            .spec()
            .post(`${baseUrl}/company/`)
            .withJson({
                "name": "ARTHUR1",
                "cnpj": "12345678000199",
                "state": "SP",
                "city": "Criciuma",
                "address": "arthur@gmail.com",
                "sector": "trez",
            })

        await p
            .spec()
            .post(`${baseUrl}/company/`)
            .withJson({
                "name": "ARTHUR1",
                "cnpj": "12345678000199",
                "state": "SP",
                "city": "Criciuma",
                "address": "arthur@gmail.com",
                "sector": "trez",
            }).expectStatus(StatusCodes.BAD_REQUEST)
    });

    it('Cria um produto na empresa', async () => {
        const produto = await p
            .spec()
            .post(`${baseUrl}/company/${idCompanhia}/products/`)
            .withJson({
                "productName": "barco",
                "productDescription": "Bmw 320i",
                "price": 200000
            }).expectStatus(StatusCodes.CREATED)
        idProduto = produto.body.product.productId
    });

    it('Atualiza um produto da empresa', async () => {
        console.log(idCompanhia)
        console.log(idProduto)
        const editaProduto = await p
            .spec()
            .put(`${baseUrl}/company/${idCompanhia}/products/${idProduto}`)
            .withJson({
                "productName": "bicicleta",
                "productDescription": "BMX",
                "price": 20
            })
    });

    it('Deve criar um serviço', async () => {
        const servico = await pactum
            .spec()
            .post(`${baseUrl}/company/${idCompanhia}/services`)
            .withJson({
                "serviceId": 28183, // Normalmente, isso pode ser gerado automaticamente pela API
                "serviceName": "Consulta Médica",
                "serviceDescription": "Serviço de consultas médicas gerais."
            })
        idServico = servico.body.services.serviceId
    })

    it('Deve alterar um serviço', async () => {
        const servico1 = await pactum
            .spec()
            .put(`${baseUrl}/company/${idCompanhia}/services/${idServico}`)
            .withJson({
                "serviceName": "Consulta Odontologica",
                "serviceDescription": "Serviço de consultas odontologicas gerais."
            })
    })

    it('Não deve permitir criar um serviço sem nome', async () => {
        const v = await pactum
            .spec()
            .post(`${baseUrl}/company/${idCompanhia}/services`)
            .withJson({
                "serviceId": 0,
                "serviceDescription": "Serviço sem nome."
            })
            .expectStatus(StatusCodes.BAD_REQUEST);  
    });
    
    it('Deve adicionar um funcionário', async () => {
        const funcionarioReq = await pactum
            .spec()
            .post(`${baseUrl}/company/${idCompanhia}/employees`)
            .withJson({
                "name": "João Silva",
                "position": "Development",
                "email": "joaozada@gmail.com"
            })
            .expectStatus(StatusCodes.CREATED)
            idFuncionario = funcionarioReq.body.employees.employeeId
    })

    it('Deve listar um funcionário pelo ID', async () => {
        await pactum
            .spec()
            .get(`${baseUrl}/company/${idCompanhia}/employees/${idFuncionario}`)
            .expectStatus(StatusCodes.OK)
    });

    it('Deleta um funcionario pelo Id', async () => {
        await p
            .spec()
            .delete(`${baseUrl}/company/${idCompanhia}/employees/${idFuncionario}`)
            .expectStatus(StatusCodes.OK)
    });

    it('Deve listar um serviço pelo ID', async () => {
        await pactum
            .spec()
            .get(`${baseUrl}/company/${idCompanhia}/services/${idServico}`)
            .expectStatus(StatusCodes.OK)
    });

    it('Deleta um serviço pelo Id', async () => {
        await p
            .spec()
            .delete(`${baseUrl}/company/${idCompanhia}/services/${idServico}`)
            .expectStatus(StatusCodes.OK)
    });

    it('Deleta uma empresa pelo Id', async () => {
        await p
            .spec()
            .delete(`${baseUrl}/company/${idCompanhia}/`)
            .expectStatus(StatusCodes.OK)
    });

});
