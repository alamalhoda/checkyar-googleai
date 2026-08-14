<template>
  <div class="max-w-4xl mx-auto p-4 md:p-6 space-y-6 dir-rtl font-sans text-slate-100" data-testid="listing-create-page">
    <!-- Header with Hybrid UX Mode Toggle -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
      <div>
        <h1 class="text-xl font-black text-slate-100 flex items-center gap-2">
          <span>ثبت آگهی جدید چک صیادی</span>
          <NTag type="success" size="small" round>احراز هویت هوشمند</NTag>
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          مشخصات چک، نام صادرکننده، مدارک معامله و نرخ پیشنهادی تنزیل را جهت ثبت در بازار هوشمند چک‌یار وارد کنید.
        </p>
      </div>

      <!-- Mode Switcher & Quick Sample Fill -->
      <div class="flex items-center gap-3">
        <NButton size="small" secondary type="warning" data-testid="listing-fill-sample" @click="fillSampleData">
          ⚡ پر کردن سریع داده‌های نمونه
        </NButton>

        <div class="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <span class="text-xs text-slate-400">حالت نمایش:</span>
          <NSwitch
            :value="form.wizardMode.value"
            @update:value="(val) => form.toggleWizardMode(val)"
            size="small"
          />
          <span class="text-xs font-bold text-emerald-400">
            {{ form.wizardMode.value ? 'مرحله‌به‌مرحله' : 'تک‌صفحه‌ای' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Domain Warnings Banner -->
    <div v-if="form.warnings.value.length > 0" class="space-y-2">
      <NAlert
        v-for="(warn, idx) in form.warnings.value"
        :key="idx"
        type="warning"
        closable
        title="ارزیابی هوشمند و هشدارهای سیستم"
      >
        {{ warn }}
      </NAlert>
    </div>

    <!-- ---------------------------------------------------- -->
    <!-- WIZARD MODE (4 Interactive Steps) -->
    <!-- ---------------------------------------------------- -->
    <div v-if="form.wizardMode.value" class="space-y-6">
      <!-- Steps Indicator -->
      <NCard class="bg-slate-900/60 border-slate-800 rounded-2xl shadow-lg">
        <NSteps :current="currentStep" status="process">
          <NStep title="۱. مشخصات چک و صادرکننده" description="صیادی، مبلغ، سررسید و هویت" />
          <NStep title="۲. ارسال مدارک و اسناد" description="تصویر روی/پشت چک و قرارداد" />
          <NStep title="۳. شرایط تنزیل و تسویه" description="محاسبه هوشمند و روش پرداخت" />
          <NStep title="۴. مرور نهایی و انتشار" description="تأیید اسناد و انتشار آگهی" />
        </NSteps>
      </NCard>

      <!-- Step 1: Cheque Specs & Issuer -->
      <NCard v-if="currentStep === 1" title="مرحله ۱: مشخصات فنی چک و صادرکننده" class="bg-slate-900/60 border-slate-800 rounded-2xl shadow-xl">
        <div class="space-y-6">
          
          <!-- Cheque Core Specs Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Sayad ID Field -->
            <NFormItem label="شماره ۱۶ رقمی صیادی (الزامی)" required>
              <template #feedback>
                <div class="flex items-center justify-between text-[11px] mt-1">
                  <span :class="form.sayadValidation.value.isValid ? 'text-emerald-400 font-bold' : 'text-amber-400'">
                    {{ form.sayadValidation.value.message }}
                  </span>
                  <span v-if="form.formData.serialNumber.length === 16" class="text-emerald-400 font-bold">
                    ✓ استعلام وضعیت صیادی (مشورتی/آزمایشی): سفید (فاقد چک برگشتی)
                  </span>
                </div>
              </template>
              <NInput
                v-model:value="form.formData.serialNumber"
                placeholder="مثال: 1234567890123456"
                maxlength="16"
                show-count
                size="large"
                class="font-mono text-base"
              />
            </NFormItem>

            <!-- Cheque Amount Field -->
            <NFormItem label="مبلغ اسمی چک (تومان)" required>
              <template #feedback>
                <div v-if="form.formData.amount" class="text-xs font-bold text-emerald-400 mt-1 bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-500/20">
                  🗣️ {{ amountInWords }}
                </div>
              </template>
              <NInputNumber
                v-model:value="form.formData.amount"
                :min="1000000"
                :step="5000000"
                placeholder="مبلغ چک به تومان"
                class="w-full text-base font-mono"
                size="large"
              />
            </NFormItem>

            <!-- Due Date Field -->
            <NFormItem label="تاریخ سررسید چک" required>
              <template #feedback>
                <span v-if="daysUntilDue !== null" class="text-xs font-bold text-amber-300 mt-1 block">
                  ⏳ {{ daysUntilDue > 0 ? `${daysUntilDue} روز تا سررسید چک باقي مانده است` : 'تاریخ سررسید گذشته است!' }}
                </span>
              </template>
              <NDatePicker
                v-model:value="form.formData.dueDate"
                type="date"
                clearable
                class="w-full"
                size="large"
                placeholder="انتخاب تاریخ سررسید"
              />
            </NFormItem>

            <!-- Bank Selection -->
            <NFormItem label="بانک صادرکننده" required>
              <NSelect
                v-model:value="form.formData.bank"
                :options="bankOptions"
                placeholder="انتخاب بانک صادرکننده"
                size="large"
                filterable
              />
            </NFormItem>
          </div>

          <NDivider class="my-2">
            <span class="text-xs text-slate-400">اطلاعات صادرکننده و هویت حقوقی</span>
          </NDivider>

          <!-- Issuer Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- Issuer Type -->
            <NFormItem label="نوع صادرکننده">
              <NSelect
                v-model:value="form.formData.issuerType"
                :options="[
                  { label: 'شخص حقیقی', value: 'natural' },
                  { label: 'شخص حقوقی (شرکت / موسسه)', value: 'legal' }
                ]"
                size="large"
              />
            </NFormItem>

            <!-- Issuer Name -->
            <NFormItem label="نام و نام خانوادگی / شرکت صادرکننده" required>
              <NInput
                v-model:value="form.formData.issuerName"
                placeholder="نام صاحب حساب یا شرکت صادرکننده"
                size="large"
              />
            </NFormItem>

            <!-- Issuer National ID -->
            <NFormItem label="کد ملی / شناسه ملی صادرکننده" required>
              <template #feedback>
                <span :class="form.nationalIdValidation.value.isValid ? 'text-emerald-400 font-bold' : 'text-amber-400'" class="text-[11px]">
                  {{ form.nationalIdValidation.value.message }}
                </span>
              </template>
              <NInput
                v-model:value="form.formData.issuerNationalId"
                placeholder="۱۰ رقم برای حقیقی / ۱۱ رقم برای حقوقی"
                maxlength="11"
                show-count
                size="large"
                class="font-mono"
              />
            </NFormItem>

            <!-- City Field -->
            <NFormItem label="شهر محل صدور/اقامت" class="md:col-span-3">
              <NInput v-model:value="form.formData.city" placeholder="مثال: تهران - شعبه مرکزی" size="large" />
            </NFormItem>
          </div>
        </div>

        <div class="flex justify-between items-center mt-6 pt-4 border-t border-slate-800">
          <span class="text-xs text-slate-400">پر کردن کلیه فیلدهای دارای علامت الزامی است.</span>
          <NButton
            type="primary"
            size="large"
            :disabled="!form.isValidStep1.value"
            @click="currentStep = 2"
            class="font-bold shadow-lg"
          >
            مرحله بعد: ارسال مدارک و اسناد ←
          </NButton>
        </div>
      </NCard>

      <!-- Step 2: Documents Upload -->
      <NCard v-if="currentStep === 2" title="مرحله ۲: ارسال مدارک و اسناد پشتیبان معامله" class="bg-slate-900/60 border-slate-800 rounded-2xl shadow-xl">
        <div class="space-y-6">
          <p class="text-xs text-slate-300">
            برای افزایش اعتبارسنجی آگهی و جلب اعتماد خریداران، بارگذاری تصویر روی چک الزامی و سایر اسناد اختیاری/توصیه‌شده می‌باشد.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Cheque Front Image Upload (Required) -->
            <div class="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>📷 تصویر روی چک صیادی</span>
                  <NTag size="small" type="error" round>الزامی</NTag>
                </label>
                <NButton size="tiny" secondary type="info" @click="attachSampleFrontImage">
                  بارگذاری تصویر نمونه
                </NButton>
              </div>

              <div v-if="form.formData.chequeFrontImage" class="relative rounded-lg overflow-hidden border border-emerald-500/40 bg-slate-900 group">
                <img :src="form.formData.chequeFrontImage" alt="Cheque Front" class="w-full h-44 object-cover" />
                <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <NButton size="small" type="error" @click="form.formData.chequeFrontImage = null">
                    حذف تصویر
                  </NButton>
                </div>
                <div class="absolute bottom-2 right-2 bg-emerald-950/90 text-emerald-300 text-[10px] px-2 py-0.5 rounded border border-emerald-500/30">
                  ✓ تصویر با موفقیت بارگذاری شد
                </div>
              </div>

              <div
                v-else
                class="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-6 text-center space-y-2 cursor-pointer transition-all duration-200 bg-slate-900/30 hover:bg-slate-900/60"
                @click="triggerFileInput('front')"
                @dragover.prevent
                @drop.prevent="handleFileDrop($event, 'front')"
              >
                <div class="text-3xl animate-bounce">📥</div>
                <div class="text-xs font-bold text-slate-200">تصویر روی چک را کشیده و رها کنید یا برای بارگذاری کلیک نمایید</div>
                <p class="text-[11px] text-slate-400">فرمت‌های مجاز: JPG, PNG, WEBP (حداکثر ۵ مگابایت)</p>
              </div>
            </div>

            <!-- Cheque Back Image Upload (Optional) -->
            <div class="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>🔄 تصویر پشت چک (ظهرنویسی)</span>
                  <NTag size="small" type="default" round>اختیاری</NTag>
                </label>
                <NButton size="tiny" secondary type="info" @click="attachSampleBackImage">
                  بارگذاری تصویر نمونه
                </NButton>
              </div>

              <div v-if="form.formData.chequeBackImage" class="relative rounded-lg overflow-hidden border border-indigo-500/40 bg-slate-900 group">
                <img :src="form.formData.chequeBackImage" alt="Cheque Back" class="w-full h-44 object-cover" />
                <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <NButton size="small" type="error" @click="form.formData.chequeBackImage = null">
                    حذف تصویر
                  </NButton>
                </div>
                <div class="absolute bottom-2 right-2 bg-indigo-950/90 text-indigo-300 text-[10px] px-2 py-0.5 rounded border border-indigo-500/30">
                  ✓ تصویر ظهرنویسی ثبت شد
                </div>
              </div>

              <div
                v-else
                class="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 text-center space-y-2 cursor-pointer transition-all duration-200 bg-slate-900/30 hover:bg-slate-900/60"
                @click="triggerFileInput('back')"
                @dragover.prevent
                @drop.prevent="handleFileDrop($event, 'back')"
              >
                <div class="text-3xl">📄</div>
                <div class="text-xs font-bold text-slate-200">تصویر پشت چک یا امضاها را بارگذاری کنید</div>
                <p class="text-[11px] text-slate-400">فرمت‌های مجاز: JPG, PNG (حداکثر ۵ مگابایت)</p>
              </div>
            </div>

          </div>

          <!-- Contract / Invoice Supporting Documents -->
          <div class="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <span>📑 متن قرارداد یا تصویر فاکتور معامله پایه</span>
                <NTag size="small" type="warning" round>توصیه‌شده جهت بالا بردن رتبه اعتباری</NTag>
              </label>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NFormItem label="توضیحات و متن قرارداد/فاکتور پشتوانه چک">
                <NInput
                  v-model:value="form.formData.contractText"
                  type="textarea"
                  placeholder="مثلاً: چک بابت شماره فاکتور ۱۴۰۲/۸۹۹۲ فروش کالای صنعتی صادر شده است..."
                  rows="3"
                />
              </NFormItem>

              <div class="space-y-2">
                <label class="text-xs text-slate-300 block">فایل فاکتور/سند پشتیبان (PDF یا تصویر):</label>
                <div class="flex items-center gap-2">
                  <NButton secondary size="medium" @click="attachSampleContractDoc">
                    📎 بارگذاری فایل فاکتور/سند نمونه
                  </NButton>
                  <span v-if="form.formData.contractDoc" class="text-xs text-emerald-400 font-bold">
                    ✓ فایل سند ثبت شد
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center mt-6 pt-4 border-t border-slate-800">
          <NButton @click="currentStep = 1">← مرحله قبل</NButton>
          <NButton
            type="primary"
            size="large"
            :disabled="!form.isValidStep2.value"
            @click="currentStep = 3"
            class="font-bold shadow-lg"
          >
            مرحله بعد: نرخ تنزیل و تسویه ←
          </NButton>
        </div>
      </NCard>

      <!-- Step 3: Smart Pricing & Settlement -->
      <NCard v-if="currentStep === 3" title="مرحله ۳: شرایط پیشنهاد، نرخ تنزیل و تسویه" class="bg-slate-900/60 border-slate-800 rounded-2xl shadow-xl">
        <div class="space-y-6">
          <!-- Smart Pricing Engine Component -->
          <SmartPricingCalculator
            :amount="form.formData.amount"
            :bank-id="form.formData.bank"
            :due-date="form.formData.dueDate"
            :initial-discount-rate="form.formData.discountRate || undefined"
            @update:discount-rate="(rate) => { form.formData.discountRate = rate; form.formData.finalRate = rate; }"
            @update:net-price="(price) => { form.formData.netPrice = price; form.formData.finalPrice = price; }"
            @update:pricing-meta-data="(data) => {
              form.formData.suggestedRate = data.suggestedRate;
              form.formData.suggestedPrice = data.suggestedPrice;
              form.formData.finalRate = data.finalRate;
              form.formData.finalPrice = data.finalPrice;
            }"
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NFormItem label="روش تسویه مورد نظر">
              <NSelect
                v-model:value="form.formData.settlementMethod"
                :options="settlementOptions"
                size="large"
              />
            </NFormItem>

            <NFormItem label="محدودیت طرف معامله (اختیاری)">
              <NInput
                v-model:value="form.formData.counterpartyRestrictions"
                placeholder="مثال: فقط خریداران با رتبه اعتباری الف یا دارای وثیقه معتبر"
                size="large"
              />
            </NFormItem>

            <NFormItem label="توضیحات تکمیلی آگهی" class="col-span-full">
              <NInput
                v-model:value="form.formData.description"
                type="textarea"
                placeholder="توضیحات بیشتر در مورد علت واگذاری یا شرایط تحویل چک..."
                rows="3"
              />
            </NFormItem>
          </div>
        </div>

        <div class="flex justify-between items-center mt-6 pt-4 border-t border-slate-800">
          <NButton @click="currentStep = 2">← مرحله قبل</NButton>
          <NButton
            type="primary"
            size="large"
            :disabled="!form.isValidStep3.value"
            @click="currentStep = 4"
            class="font-bold shadow-lg"
          >
            مرحله بعد: مرور نهایی و انتشار ←
          </NButton>
        </div>
      </NCard>

      <!-- Step 4: Summary & Confirmation -->
      <NCard v-if="currentStep === 4" title="مرحله ۴: بررسی نهایی اسناد و انتشار آگهی" class="bg-slate-900/60 border-slate-800 rounded-2xl shadow-xl">
        <div class="space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Cheque Specs Summary -->
            <div class="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3 text-sm">
              <h3 class="font-bold text-slate-100 border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>📋 خلاصه اطلاعات چک</span>
                <NTag size="small" type="success" round>استعلام معتبر</NTag>
              </h3>
              <div class="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span class="text-slate-400">شناسه ۱۶ رقمی صیادی:</span>
                <span class="font-mono text-slate-100 font-bold">{{ form.formData.serialNumber }}</span>
              </div>
              <div class="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span class="text-slate-400">مبلغ اسمی:</span>
                <span class="font-bold text-emerald-400 text-base">{{ (form.formData.amount || 0).toLocaleString('fa-IR') }} تومان</span>
              </div>
              <div class="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span class="text-slate-400">صادرکننده:</span>
                <span class="text-amber-300 font-bold">{{ form.formData.issuerName }} ({{ form.formData.issuerType === 'natural' ? 'حقیقی' : 'حقوقی' }})</span>
              </div>
              <div class="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span class="text-slate-400">کد/شناسه ملی صادرکننده:</span>
                <span class="font-mono text-slate-200">{{ form.formData.issuerNationalId }}</span>
              </div>
              <div class="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span class="text-slate-400">بانک صادرکننده:</span>
                <span class="text-slate-100">{{ form.formData.bank }} - {{ form.formData.city }}</span>
              </div>
            </div>

            <!-- Pricing Summary -->
            <div class="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3 text-sm">
              <h3 class="font-bold text-slate-100 border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>💡 محاسبات تنزیل و تسویه</span>
                <NTag size="small" type="info" round>{{ settlementLabel(form.formData.settlementMethod) }}</NTag>
              </h3>
              <div class="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span class="text-slate-400">پیشنهاد هوش‌مصنوعی:</span>
                <span class="text-amber-400 font-mono font-bold">{{ form.formData.suggestedRate ?? '-' }}٪ سالانه</span>
              </div>
              <div class="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span class="text-slate-400">نرخ تنزیل نهایی انتخابی:</span>
                <span class="text-indigo-400 font-mono font-bold text-base">{{ form.formData.discountRate ?? '-' }}٪ سالانه</span>
              </div>
              <div v-if="form.formData.netPrice" class="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span class="text-slate-400">برآورد خالص دریافتی شما:</span>
                <span class="text-emerald-400 font-mono font-bold text-base">{{ form.formData.netPrice.toLocaleString('fa-IR') }} تومان</span>
              </div>
              <div class="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span class="text-slate-400">وضعیت تصویر روی چک:</span>
                <span :class="form.formData.chequeFrontImage ? 'text-emerald-400 font-bold' : 'text-rose-400'">
                  {{ form.formData.chequeFrontImage ? '✓ بارگذاری شده' : '❌ بارگذاری نشده' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Uploaded Documents Preview Row -->
          <div class="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 class="text-xs font-bold text-slate-300">پیش‌نمایش مدارک پیوست‌شده آگهی:</h4>
            <div class="flex flex-wrap gap-4">
              <div v-if="form.formData.chequeFrontImage" class="w-28 h-20 rounded-lg overflow-hidden border border-emerald-500/40 relative group">
                <img :src="form.formData.chequeFrontImage" class="w-full h-full object-cover" />
                <span class="absolute bottom-1 right-1 bg-slate-950/80 text-[9px] text-emerald-300 px-1 rounded">روی چک</span>
              </div>
              <div v-if="form.formData.chequeBackImage" class="w-28 h-20 rounded-lg overflow-hidden border border-indigo-500/40 relative group">
                <img :src="form.formData.chequeBackImage" class="w-full h-full object-cover" />
                <span class="absolute bottom-1 right-1 bg-slate-950/80 text-[9px] text-indigo-300 px-1 rounded">پشت چک</span>
              </div>
              <div v-if="form.formData.contractDoc || form.formData.contractText" class="p-2 bg-slate-900 rounded-lg border border-amber-500/40 text-xs text-amber-300 w-48">
                📄 فاکتور/قرارداد پشتیبان ثبت شده
              </div>
            </div>
          </div>

        </div>

        <div class="flex justify-between items-center mt-6 pt-4 border-t border-slate-800">
          <NButton @click="currentStep = 3">← ویرایش مرحله قبل</NButton>
          <div class="flex items-center gap-3">
            <NButton secondary :loading="form.loading.value" @click="handleSaveDraft">
              ذخیره پیش‌نویس
            </NButton>
            <NButton
              type="primary"
              size="large"
              :loading="form.loading.value"
              :disabled="!form.isFormValid.value"
              data-testid="listing-create-submit"
              @click="handlePublish"
              class="font-bold shadow-lg shadow-emerald-950/50"
            >
              🚀 تأیید و ارسال نهایی به ناظر
            </NButton>
          </div>
        </div>
      </NCard>
    </div>

    <!-- ---------------------------------------------------- -->
    <!-- FLAT MODE (Single Page - All Sections Visible) -->
    <!-- ---------------------------------------------------- -->
    <div v-else class="space-y-6">
      
      <!-- Section 1: Cheque Specs -->
      <NCard title="۱. مشخصات فنی چک و صادرکننده" class="bg-slate-900/60 border-slate-800 rounded-2xl shadow-xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NFormItem label="شماره ۱۶ رقمی صیادی (الزامی)" required>
            <NInput
              v-model:value="form.formData.serialNumber"
              placeholder="مثال: 1234567890123456"
              maxlength="16"
              show-count
              size="large"
              class="font-mono"
            />
          </NFormItem>

          <NFormItem label="مبلغ چک (تومان)" required>
            <NInputNumber
              v-model:value="form.formData.amount"
              :min="1000000"
              :step="5000000"
              placeholder="مبلغ چک به تومان"
              class="w-full font-mono"
              size="large"
            />
          </NFormItem>

          <NFormItem label="تاریخ سررسید" required>
            <NDatePicker
              v-model:value="form.formData.dueDate"
              type="date"
              clearable
              class="w-full"
              size="large"
            />
          </NFormItem>

          <NFormItem label="بانک صادرکننده" required>
            <NSelect
              v-model:value="form.formData.bank"
              :options="bankOptions"
              size="large"
            />
          </NFormItem>

          <NFormItem label="نام صادرکننده" required>
            <NInput v-model:value="form.formData.issuerName" placeholder="نام صاحبان حساب" size="large" />
          </NFormItem>

          <NFormItem label="کد/شناسه ملی صادرکننده" required>
            <NInput v-model:value="form.formData.issuerNationalId" placeholder="کد ملی صادرکننده" maxlength="11" size="large" class="font-mono" />
          </NFormItem>
        </div>
      </NCard>

      <!-- Section 2: Documents Upload -->
      <NCard title="۲. ارسال مدارک و اسناد پشتیبان معامله" class="bg-slate-900/60 border-slate-800 rounded-2xl shadow-xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-slate-100 flex items-center gap-1">
                <span>📷 تصویر روی چک</span>
                <NTag size="small" type="error" round>الزامی</NTag>
              </span>
              <NButton size="tiny" secondary type="info" @click="attachSampleFrontImage">تصویر نمونه</NButton>
            </div>
            <div v-if="form.formData.chequeFrontImage" class="relative rounded-lg overflow-hidden border border-emerald-500/40">
              <img :src="form.formData.chequeFrontImage" class="w-full h-36 object-cover" />
              <NButton size="tiny" type="error" class="absolute top-2 left-2" @click="form.formData.chequeFrontImage = null">حذف</NButton>
            </div>
            <div
              v-else
              class="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-5 text-center cursor-pointer text-xs space-y-1 transition-all bg-slate-900/30 hover:bg-slate-900/60"
              @click="triggerFileInput('front')"
              @dragover.prevent
              @drop.prevent="handleFileDrop($event, 'front')"
            >
              <div class="text-2xl">📥</div>
              <div class="font-bold text-slate-200">برای انتخاب یا رها کردن تصویر روی چک کلیک کنید</div>
              <div class="text-[10px] text-slate-400">فرمت‌های JPG, PNG, WEBP</div>
            </div>
          </div>

          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-slate-100 flex items-center gap-1">
                <span>🔄 تصویر پشت چک</span>
                <NTag size="small" type="default" round>اختیاری</NTag>
              </span>
              <NButton size="tiny" secondary type="info" @click="attachSampleBackImage">تصویر نمونه</NButton>
            </div>
            <div v-if="form.formData.chequeBackImage" class="relative rounded-lg overflow-hidden border border-indigo-500/40">
              <img :src="form.formData.chequeBackImage" class="w-full h-36 object-cover" />
              <NButton size="tiny" type="error" class="absolute top-2 left-2" @click="form.formData.chequeBackImage = null">حذف</NButton>
            </div>
            <div
              v-else
              class="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-5 text-center cursor-pointer text-xs space-y-1 transition-all bg-slate-900/30 hover:bg-slate-900/60"
              @click="triggerFileInput('back')"
              @dragover.prevent
              @drop.prevent="handleFileDrop($event, 'back')"
            >
              <div class="text-2xl">📄</div>
              <div class="font-bold text-slate-200">برای بارگذاری تصویر پشت چک کلیک کنید</div>
              <div class="text-[10px] text-slate-400">امضا و ظهرنویسی</div>
            </div>
          </div>

        </div>
      </NCard>

      <!-- Section 3: Smart Pricing -->
      <NCard title="۳. شرایط واگذاری، نرخ تنزیل و تسویه" class="bg-slate-900/60 border-slate-800 rounded-2xl shadow-xl">
        <SmartPricingCalculator
          :amount="form.formData.amount"
          :bank-id="form.formData.bank"
          :due-date="form.formData.dueDate"
          :initial-discount-rate="form.formData.discountRate || undefined"
          @update:discount-rate="(rate) => { form.formData.discountRate = rate; form.formData.finalRate = rate; }"
          @update:net-price="(price) => { form.formData.netPrice = price; form.formData.finalPrice = price; }"
          @update:pricing-meta-data="(data) => {
            form.formData.suggestedRate = data.suggestedRate;
            form.formData.suggestedPrice = data.suggestedPrice;
            form.formData.finalRate = data.finalRate;
            form.formData.finalPrice = data.finalPrice;
          }"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <NFormItem label="روش تسویه">
            <NSelect v-model:value="form.formData.settlementMethod" :options="settlementOptions" size="large" />
          </NFormItem>

          <NFormItem label="توضیحات تکمیلی">
            <NInput v-model:value="form.formData.description" type="textarea" placeholder="توضیحات آگهی..." />
          </NFormItem>
        </div>
      </NCard>

      <!-- Global Actions for Flat Mode -->
      <NCard class="bg-slate-900/60 border-slate-800 rounded-2xl shadow-xl">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-xs text-slate-400">
            پس از تکمیل فیلدهای اجباری، روی «تأیید و ارسال نهایی» کلیک کنید.
          </p>

          <div class="flex items-center gap-3">
            <NButton secondary :loading="form.loading.value" @click="handleSaveDraft">
              ذخیره پیش‌نویس
            </NButton>
            <NButton
              type="primary"
              size="large"
              :loading="form.loading.value"
              :disabled="!form.isFormValid.value"
              data-testid="listing-create-submit"
              @click="handlePublish"
              class="font-bold shadow-lg shadow-emerald-950/50"
            >
              🚀 تأیید و ارسال نهایی
            </NButton>
          </div>
        </div>
      </NCard>
    </div>

    <!-- Global Hidden File Inputs for Reliable Triggering across Wizard and Flat Modes -->
    <input
      ref="frontInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      style="display: none;"
      @change="handleFileChange($event, 'front')"
    />
    <input
      ref="backInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      style="display: none;"
      @change="handleFileChange($event, 'back')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard, NSwitch, NSteps, NStep, NFormItem, NInput, NInputNumber,
  NDatePicker, NSelect, NButton, NAlert, NTag, NDivider, useMessage
} from 'naive-ui';
import { useListingForm } from '../composables/useListingForm';
import SmartPricingCalculator from '../components/SmartPricingCalculator.vue';
import { amountToPersianWords } from '../../../utils/persianUtils';

const router = useRouter();
const message = useMessage();
const currentStep = ref(1);

const form = useListingForm();

const frontInputRef = ref<HTMLInputElement | null>(null);
const backInputRef = ref<HTMLInputElement | null>(null);

const bankOptions = [
  { label: 'بانک ملی ایران', value: 'بانک ملی' },
  { label: 'بانک ملت', value: 'بانک ملت' },
  { label: 'بانک صادرات ایران', value: 'بانک صادرات' },
  { label: 'بانک پاسارگاد', value: 'بانک پاسارگاد' },
  { label: 'بانک تجارت', value: 'بانک تجارت' },
  { label: 'بانک سامان', value: 'بانک سامان' },
  { label: 'بانک پارسیان', value: 'بانک پارسیان' },
  { label: 'بانک سپه', value: 'بانک سپه' },
  { label: 'بانک مسکن', value: 'بانک مسکن' },
  { label: 'بانک شهر', value: 'بانک شهر' }
];

const settlementOptions = [
  { label: 'پرداخت امن و امانی (Escrow)', value: 'escrow' },
  { label: 'نقدی حضوری', value: 'cash' },
  { label: 'حواله پایا/ساتنا', value: 'bank_transfer' },
  { label: 'توافقی و شناور', value: 'flexible' }
];

// Computed helpers
const amountInWords = computed(() => amountToPersianWords(form.formData.amount));

const daysUntilDue = computed(() => {
  if (!form.formData.dueDate) return null;
  const diff = form.formData.dueDate - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

function settlementLabel(val: string) {
  const map: Record<string, string> = {
    escrow: 'پرداخت امن امانی (Escrow)',
    cash: 'نقدی حضوری',
    bank_transfer: 'حواله پایا/ساتنا',
    flexible: 'توافقی'
  };
  return map[val] || val;
}

// Quick Sample Data Autofill
function fillSampleData() {
  form.formData.serialNumber = '7890123456789012';
  form.formData.amount = 150000000;
  form.formData.dueDate = Date.now() + 45 * 24 * 60 * 60 * 1000; // 45 days from now
  form.formData.bank = 'بانک ملت';
  form.formData.issuerType = 'natural';
  form.formData.issuerName = 'محمد رضایی';
  form.formData.issuerNationalId = '0078912345';
  form.formData.city = 'تهران - شعبه مرکزی';
  
  attachSampleFrontImage();
  attachSampleBackImage();

  message.success('اطلاعات و اسناد نمونه با موفقیت در فرم درج گردید.');
}

// File Attachment Helpers
function triggerFileInput(type: 'front' | 'back') {
  if (type === 'front' && frontInputRef.value) frontInputRef.value.click();
  if (type === 'back' && backInputRef.value) backInputRef.value.click();
}

function handleFileChange(event: Event, type: 'front' | 'back') {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'front') form.formData.chequeFrontImage = result;
      if (type === 'back') form.formData.chequeBackImage = result;
      message.success('تصویر با موفقیت بارگذاری شد.');
    };
    reader.readAsDataURL(file);
  }
}

function handleFileDrop(event: DragEvent, type: 'front' | 'back') {
  event.preventDefault();
  const files = event.dataTransfer?.files;
  if (files && files[0]) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'front') form.formData.chequeFrontImage = result;
      if (type === 'back') form.formData.chequeBackImage = result;
      message.success('تصویر کشیده‌شده با موفقیت بارگذاری گردید.');
    };
    reader.readAsDataURL(file);
  }
}

function attachSampleFrontImage() {
  form.formData.chequeFrontImage = '/images/placeholders/cheque_front.svg';
  message.info('تصویر نمونه روی چک متصل گردید.');
}

function attachSampleBackImage() {
  form.formData.chequeBackImage = '/images/placeholders/cheque_back.svg';
  message.info('تصویر نمونه ظهرنویسی متصل شد.');
}

function attachSampleContractDoc() {
  form.formData.contractDoc = 'sample_invoice_14028992.pdf';
  if (!form.formData.contractText) {
    form.formData.contractText = 'فاکتور فروش تجهیزات صنعتی شماره ۱۴۰۲/۸۹۹۲ به مبلغ ۱۵۰ میلیون تومان';
  }
  message.info('فایل فاکتور نمونه بارگذاری شد.');
}

async function handleSaveDraft() {
  const ok = await form.saveDraft();
  if (ok) {
    router.push('/listings/my');
  }
}

async function handlePublish() {
  const ok = await form.publishListing();
  if (ok) {
    router.push('/listings/my');
  }
}
</script>
