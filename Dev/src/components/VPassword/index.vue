<template>
	<p>
		<label for="password">
	        <div class="text">{{title}}</div>
	        <input name="password" id="password" 
	        :type="isVisible?'password':'text'"
	        :class="{'is-focus': focus}"
	       	:value="currentValue"
	       	@focus="VFocus"
	        @blur="VBlur"
	        @input="handleInput">
	    </label>
	    <span v-show="isError" class="error-tip">{{errorText}}</span>	
	</p>
</template>
<script src="./main.js"></script>
<style scoped src="./layout.less"></style>