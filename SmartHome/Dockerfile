
FROM ://microsoft.com AS build
WORKDIR /src

COPY ["SmartHome.csproj", "./"]
RUN dotnet restore "./SmartHome.csproj"

COPY . .
RUN dotnet publish "./SmartHome.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM ://microsoft.com AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:${PORT:-8080}

ENTRYPOINT ["dotnet", "SmartHome.dll"]