<template>
	<CRow class="mb-3">
		<CCol :xs="3">
			<VueDatePicker v-model="date" range :enable-time-picker="false" />
		</CCol>
		<CCol :xs="3">
			<select v-model="branchId" class="form-select" aria-label="Default select example">
				<option value="0">Şube seçiniz</option>
				<option v-for="branch in branches" :key="branch.id" :value="branch.id">{{ branch.name }}</option>
			</select>
		</CCol>
		<CCol :xs="3">
			<CButton @click="fetchData" style="color: white;" color="info">Getir</CButton>
		</CCol>
	</CRow>
	<CRow>
		<CCol :xs="3">
			<CWidgetStatsB class="mb-3">
				<template #title>Dolar Kuru</template>
				<template #value>{{ cardsData.dollarRate }} PLN</template>
			</CWidgetStatsB>
		</CCol>
		<CCol :xs="3">
			<CWidgetStatsB class="mb-3">
				<template #title>Ciro</template>
				<template #value>{{ cardsData.endorsement }} $</template>
			</CWidgetStatsB>
		</CCol>
		<CCol :xs="3">
			<CWidgetStatsB class="mb-3">
				<template #title>Maliyet</template>
				<template #value>{{ cardsData.cost }} $</template>
			</CWidgetStatsB>
		</CCol>
		<CCol :xs="3">
			<CWidgetStatsB class="mb-3">
				<template #title>Net Kâr</template>
				<template #value><span v-bind:style=" cardsData.profit > 0 ? 'color: green;' : 'color: red;'">{{ cardsData.profit }} $</span></template>
			</CWidgetStatsB>
		</CCol>
		<CCol :xs="3">
			<CWidgetStatsB class="mb-3">
				<template #text>{{ cardsData.totalProfit }} $</template>
				<template #title>Kâr Eden Model Sayısı</template>
				<template #value><span style="color: green;">{{ cardsData.profitCounter }}</span> </template>
			</CWidgetStatsB>
		</CCol>
		<CCol :xs="3">
			<CWidgetStatsB class="mb-3">
				<template #text>{{ cardsData.totalLoss }} $</template>
				<template #title>Zarar Eden Model Sayısı</template>
				<template #value><span style="color: red;">{{ cardsData.lossCounter }}</span> </template>
			</CWidgetStatsB>
		</CCol>
	</CRow>
	<CRow>
		<h1>Maliyetli Ürünler</h1>
		<CCol :xs="12">
			<DataTable :data="products" class="table table-striped table-bordered display">
				<thead>
					<tr>
						<th>Model Kodu</th>
						<th>Adet</th>
						<th>USD Fabrika</th>
						<th>USD Kargo Maliyet</th>
						<th>USD Maliyet</th>
						<th>USD Satış</th>
						<th>USD Fark</th>
					</tr>
				</thead>
			</DataTable>
		</CCol>
	</CRow>
	<CRow>
		<h1>Sıfır Maliyetli Ürünler</h1>
		<CCol :xs="12">
			<DataTable :data="zeroCostProducts" class="table table-striped table-bordered display">
				<thead>
					<tr>
						<th>Model Kodu</th>
						<th>Adet</th>
						<th>USD Fabrika</th>
						<th>USD Kargo Maliyet</th>
						<th>USD Maliyet</th>
						<th>USD Satış</th>
						<th>USD Fark</th>
					</tr>
				</thead>
			</DataTable>
		</CCol>
	</CRow>
	<CRow>
		<h1>Yüksek Kargo Maliyetli Ürünler</h1>
		<CCol :xs="12">
			<DataTable :data="upperSixCargoProducts" class="table table-striped table-bordered display">
				<thead>
					<tr>
						<th>Model Kodu</th>
						<th>Adet</th>
						<th>USD Fabrika</th>
						<th>USD Kargo Maliyet</th>
						<th>USD Maliyet</th>
						<th>USD Satış</th>
						<th>USD Fark</th>
					</tr>
				</thead>
			</DataTable>
		</CCol>
	</CRow>
</template>

<script lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import DataTable from 'datatables.net-vue3';
import DataTableLib from 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';

DataTable.use(DataTableLib);

interface DataElement {
  sale_price: string;
  total_maliyet: string;
  model_code: string;
  qty: number;
  fab_maliyet: number;
  cargo_maliyet: number;
}

interface DataObject {
  usd_rate: number
}

export default {
	data() {
		return {
			date: {} as any,
			branchId: 0 as any,
			products: null as any,
			zeroCostProducts: null as any,
			upperSixCargoProducts: null as any,
			branches: this.getBranches() as any,
			cardsData: {
				"dollarRate": 0,
				"endorsement": 0,
				"cost": 0,
				"profit": 0,
				"profitCounter": 0,
				"totalProfit": 0,
				"lossCounter": 0,
				"totalLoss": 0
			} as any,
		}
	},
	components: {
		VueDatePicker,
		DataTable
	},
	mounted() {
		const startDate = new Date();
		const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
		this.date = [startDate, endDate];
	},
	methods: {
		convertDate(dateString: string) {
			const date = new Date(dateString);
			const day = String(date.getDate()).padStart(2, '0');
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const year = date.getFullYear();

			const formattedDate = `${day}.${month}.${year}`;

			return formattedDate;
		},
		async getBranches(){
			const response = await axios.get('https://app.sabra.com.pl/api/hukumdar/get/branchs');

			this.branches = response.data;
		},
		async fetchData() {
			try {
				const postData = {
					start_date: this.convertDate(this.date[0]),
					end_date: this.convertDate(this.date[1]),
					branch_id: this.branchId
				};

				const response: AxiosResponse = await axios.post('https://app.sabra.com.pl/api/hukumdar/get/model_stats', postData);
				const data = response.data;

				const dataObject = Object.values(data) as unknown as DataObject

				const processedData = []
				const processedZeroCostData = []
				const processedUpperSixCargoData = []

				let endorsement = 0;
				let cost = 0;
				let profit = 0;
				let profitCounter = 0;
				let lossCounter = 0;
				let totalProfit = 0;
				let totalLoss = 0;
	
				for (let element of Object.values<DataElement>(data)) {
					const elementProfit = (parseFloat(element.sale_price) - parseFloat(element.total_maliyet)).toFixed(2);

					let profitString = "";
					if(parseFloat(elementProfit) >= 0){
						profitString = `<span style="color: green;">${elementProfit}</span>`;
					}
					else{
						profitString = `<span style="color: red;">${elementProfit}</span>`;
					}

					if(parseFloat(element.total_maliyet) <= 0){
						processedZeroCostData.push([
							element.model_code,
							element.qty,
							element.fab_maliyet.toFixed(2),
							element.cargo_maliyet.toFixed(2),
							parseFloat(element.total_maliyet).toFixed(2),
							parseFloat(element.sale_price).toFixed(2),
							profitString
						])

						continue;
					}else if(element.cargo_maliyet >= 6){
						processedUpperSixCargoData.push([
							element.model_code,
							element.qty,
							element.fab_maliyet.toFixed(2),
							element.cargo_maliyet.toFixed(2),
							parseFloat(element.total_maliyet).toFixed(2),
							parseFloat(element.sale_price).toFixed(2),
							profitString
						])
					}
					else{
						processedData.push([
							element.model_code,
							element.qty,
							element.fab_maliyet.toFixed(2),
							element.cargo_maliyet.toFixed(2),
							parseFloat(element.total_maliyet).toFixed(2),
							parseFloat(element.sale_price).toFixed(2),
							profitString
						])
					}
					
					
					endorsement += parseFloat(element.sale_price) * element.qty;
					cost += parseFloat(element.total_maliyet) * element.qty;
					profit += parseFloat(elementProfit) * element.qty
				
					if (parseFloat(elementProfit) > 0) {
						profitCounter += 1
						totalProfit += parseFloat(elementProfit) * element.qty
					}
					else {
						lossCounter += 1
						totalLoss += parseFloat(elementProfit) * element.qty
					}

				}

				const cardsData = {
					"dollarRate": Array.isArray(dataObject) && dataObject.length > 0 ? dataObject[0].usd_rate : '',
					"endorsement": endorsement.toFixed(2),
					"cost": cost.toFixed(2),
					"profit": profit.toFixed(2),
					"profitCounter": profitCounter,
					"totalProfit": totalProfit.toFixed(2),
					"lossCounter": lossCounter,
					"totalLoss": totalLoss.toFixed(2)
				}
				
				this.cardsData = cardsData;

				this.products = processedData
				this.zeroCostProducts = processedZeroCostData
				this.upperSixCargoProducts = processedUpperSixCargoData

			} catch (error: any) {
				if (axios.isAxiosError(error)) {
					console.error('Axios Error:', error.message);
					console.error('Status Code:', error.response?.status);
				} else {
					console.error('Error:', error.message);
				}
			}
		}
	}
}
</script>

<style>
	@import 'datatables.net-dt';
</style>
